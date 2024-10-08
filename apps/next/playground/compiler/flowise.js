/**
 * Generate Logic Def from Form Def
 */
import { startNode, endNode } from './constants/transformers'
import {
  isVisibleCode,
  AskQuestion,
  runValidatorCode,
  llmCurrentInputStore,
  llmSkipCode,
  llmValidatorCode,
  storeInputCode,
  ValidationMsg,
} from './logic/snippets'

/**
 * FLOWISE CLASS: Manages the flowise Graph
 */
export class Flowise {
  constructor(parsedformilyFields) {
    this.fields = parsedformilyFields
    this.edges = []
    this.nodes = {
      start: startNode,
      end: endNode,
    }
    this.createGraph()
  }

  /**
   *
   * @returns the required Flowise JSON
   */
  toJSON() {
    return {
      nodes: Object.values(this.nodes),
      edges: this.edges,
      viewport: {
        x: -89.25227931693917,
        y: 282.4605317435965,
        zoom: 0.4464677076656672,
      },
      name: '',
    }
  }

  /**
   * Creates the graph according to the fields
   */
  createGraph() {
    // Store fields in a variable;
    const fields = this.fields

    // Foreach field, create the group of nodes and edges
    fields.forEach((field, index) => {
      // create Field Group
      this.createFieldGroup(field, index)
    })

    // Create The External Edges for each group
    // Connect each group to the next group
    const numberOfFields = fields.length
    for (let index = 0; index < numberOfFields; index++) {
      // Edge: prev-CODE_RUNNER_STORE_NODE / START (if index == 0) -> curr-CODE_RUNNER_isVISIBLE_NODE
      if (index == 0) {
        // Edge: START -> curr-CODE_RUNNER_isVISIBLE_NODE
        const start_isVisible_edge = this.createEdge(
          this.nodes['start'],
          this.nodes[`CODE_RUNNER_isVISIBLE_${index}`]
        )
        this.edges.push(start_isVisible_edge)
        // Update xMessage of curr-CODE_RUNNER_isVISIBLE_NODE
        this.xMessageConnect(`start`, `CODE_RUNNER_isVISIBLE_${index}`)
      } else {
        // Edge: prev-CODE_RUNNER_STORE_NODE -> curr-CODE_RUNNER_isVISIBLE_NODE
        const prev_isVisible_edge = this.createEdge(
          this.nodes[`CODE_RUNNER_STORE_${index - 1}`],
          this.nodes[`CODE_RUNNER_isVISIBLE_${index}`]
        )
        this.edges.push(prev_isVisible_edge)
        // Update xMessage of curr-CODE_RUNNER_isVISIBLE_NODE
        this.xMessageConnect(
          `CODE_RUNNER_STORE_${index - 1}`,
          `CODE_RUNNER_isVISIBLE_${index}`
        )
      }

      // ERROR-Edge: curr-CODE_RUNNER_isVISIBLE_NODE -> next-CODE_RUNNER_isVISIBLE_NODE / END (if index == fields.length - 1)
      if (index == fields.length - 1) {
        // ERROR-Edge: curr-CODE_RUNNER_isVISIBLE_NODE -> END
        const isVisible_end_error_edge = this.createEdge(
          this.nodes[`CODE_RUNNER_isVISIBLE_${index}`],
          this.nodes['end'],
          true
        )
        this.edges.push(isVisible_end_error_edge)
        // Update xMessage of END
        this.xMessageConnect(`CODE_RUNNER_isVISIBLE_${index}`, `end`)
      } else {
        // ERROR-Edge: curr-CODE_RUNNER_isVISIBLE_NODE -> next-CODE_RUNNER_isVISIBLE_NODE
        const isVisible_next_error_edge = this.createEdge(
          this.nodes[`CODE_RUNNER_isVISIBLE_${index}`],
          this.nodes[`CODE_RUNNER_isVISIBLE_${index + 1}`],
          true
        )
        this.edges.push(isVisible_next_error_edge)
        // Update xMessage of next-CODE_RUNNER_isVISIBLE_NODE
        this.xMessageConnect(
          `CODE_RUNNER_isVISIBLE_${index}`,
          `CODE_RUNNER_isVISIBLE_${index + 1}`
        )
      }
    }

    // Connect the last group to the END node
    // Edge: last-CODE_RUNNER_STORE_NODE -> END
    const last_Store_end_edge = this.createEdge(
      this.nodes[`CODE_RUNNER_STORE_${numberOfFields - 1}`],
      this.nodes['end']
    )
    // Update xMessage of END node
    this.xMessageConnect(`CODE_RUNNER_STORE_${numberOfFields - 1}`, `end`)
    // push last_Store_end_edge
    this.edges.push(last_Store_end_edge)
  }

  /**
   * Creates a group of nodes and edges for a field according to diagram
   * @param {*} field: field object
   * @param {*} index: index of the field
   */
  createFieldGroup(field, index) {
    // create CODE_RUNNER_isVISIBLE_NODE
    const isVisibleNode_id = `isVISIBLE_${index}`
    const isVisibleNode_Code = isVisibleCode(field)
    const isVisibleNode = this.codeRunnerNode(
      isVisibleNode_id,
      isVisibleNode_Code,
      []
    )
    const validationTypes = field['validation'] // array of validation types
    const hasLLmValidation = validationTypes.includes('llm') // boolean

    // create CODE_RUNNER_ASK_NODE
    const askNode_id = `ASK_${index}`
    const askNode_Code = AskQuestion(field)
    const askNode_xm = []
    askNode_xm.push(`${isVisibleNode['id']}.data.instance`)
    const askNode = this.codeRunnerNode(askNode_id, askNode_Code, askNode_xm)

    // Edge between CODE_RUNNER_isVISIBLE_NODE -> CODE_RUNNER_ASK_NODE
    const isVisible_Ask_edge = this.createEdge(isVisibleNode, askNode)

    // Create LLM_ASK_NODE (humanizing questions)
    const llmAskNode_id = `LLM_ASK_${index}`
    const llmAskNodeXm = []
    llmAskNodeXm.push(`${askNode['id']}.data.instance`)
    const llmAskNode = this.llmTransformerNode(
      llmAskNode_id,
      llmAskNodeXm,
      field['description']
    )

    // Edge between CODE_RUNNER_ASK_NODE -> LLM_ASK_NODE
    const ask_llmAsk_edge = this.createEdge(askNode, llmAskNode)

    // create USER_FEEDBACK_LOOP_NODE
    const userFeedbackLoopNode_xm = []
    userFeedbackLoopNode_xm.push(`${llmAskNode['id']}.data.instance`)
    const userFeedbackLoopNode = this.userFeedbackLoopNode(
      index,
      userFeedbackLoopNode_xm
    )

    // Edge between CODE_RUNNER_ASK_NODE -> USER_FEEDBACK_LOOP_NODE
    const ask_UserFeedback_edge = this.createEdge(
      llmAskNode,
      userFeedbackLoopNode
    )

    // // // DECLARING VARIABLES in COMMON SCOPES // // //
    let llmCurrentInputStoreNode
    let userFeedback_llmCurrentInputStore_edge
    let llmSkipNode
    let llmCurrentInputStore_llmSkip_edge
    let llmTransformerNode
    let llmSkip_llmTransformer_edge
    let llmValidatorNode
    let llmTransformer_llmValidator_edge

    let runValidatorNode
    let userFeedback_runValidator_edge

    // if(there is llm validation) ->  llmCurrentInputStore -> llmTransformer -> llmValidator -> storeInput -> validationMsg
    if (hasLLmValidation) {
      // create CODE_RUNNER_LLM_CURRENT_INPUT_STORE_NODE
      const llmCurrentInputStoreNode_id = `LLM_CURRENT_INPUT_STORE_${index}`
      const llmCurrentInputStoreNode_Code = llmCurrentInputStore(field)
      const llmCurrentInputStoreNode_xm = []
      llmCurrentInputStoreNode_xm.push(
        `${userFeedbackLoopNode['id']}.data.instance`
      )
      llmCurrentInputStoreNode = this.codeRunnerNode(
        llmCurrentInputStoreNode_id,
        llmCurrentInputStoreNode_Code,
        llmCurrentInputStoreNode_xm
      )

      // Edge between USER_FEEDBACK_LOOP_NODE -> CODE_RUNNER_LLM_CURRENT_INPUT_STORE_NODE
      userFeedback_llmCurrentInputStore_edge = this.createEdge(
        userFeedbackLoopNode,
        llmCurrentInputStoreNode
      )

      // create CODE_RUNNER_LLM_SKIP_NODE
      const llmSkipNode_id = `LLM_SKIP_${index}`
      const llmSkipNode_Code = llmSkipCode()
      const llmSkipNode_xm = []
      llmSkipNode_xm.push(`${llmCurrentInputStoreNode['id']}.data.instance`)
      llmSkipNode = this.codeRunnerNode(
        llmSkipNode_id,
        llmSkipNode_Code,
        llmSkipNode_xm
      )

      // Edge between CODE_RUNNER_LLM_CURRENT_INPUT_STORE_NODE -> CODE_RUNNER_LLM_SKIP_NODE
      llmCurrentInputStore_llmSkip_edge = this.createEdge(
        llmCurrentInputStoreNode,
        llmSkipNode
      )

      // create LLM_TRANSFORMER_NODE
      const llmTransformerNode_id = `${index}`
      const llmTransformerNode_xm = []
      const questionDescription = field['description']
      llmTransformerNode_xm.push(`${llmSkipNode['id']}.data.instance`)
      llmTransformerNode = this.llmTransformerNode(
        llmTransformerNode_id,
        llmTransformerNode_xm,
        questionDescription
      )

      // Edge between CODE_RUNNER_LLM_SKIP_NODE -> LLM_TRANSFORMER_NODE
      llmSkip_llmTransformer_edge = this.createEdge(
        llmSkipNode,
        llmTransformerNode
      )

      // create CODE_RUNNER_LLM_VALIDATOR_NODE
      const llmValidatorNode_id = `LLM_VALIDATOR_${index}`
      const llmValidatorNode_Code = llmValidatorCode(field)
      const llmValidatorNode_xm = []
      llmValidatorNode_xm.push(`${llmTransformerNode['id']}.data.instance`)
      llmValidatorNode = this.codeRunnerNode(
        llmValidatorNode_id,
        llmValidatorNode_Code,
        llmValidatorNode_xm
      )

      // Edge between LLM_TRANSFORMER_NODE -> CODE_RUNNER_LLM_VALIDATOR_NODE
      llmTransformer_llmValidator_edge = this.createEdge(
        llmTransformerNode,
        llmValidatorNode
      )
    } else {
      // create CODE_RUNNER_RUN_VALIDATOR_NODE
      const runValidatorNode_id = `RUN_VALIDATOR_${index}`
      const runValidatorNode_Code = runValidatorCode(field)
      const runValidatorNode_xm = []
      runValidatorNode_xm.push(`${userFeedbackLoopNode['id']}.data.instance`)
      runValidatorNode = this.codeRunnerNode(
        runValidatorNode_id,
        runValidatorNode_Code,
        runValidatorNode_xm
      )

      // Edge between USER_FEEDBACK_LOOP_NODE -> CODE_RUNNER_RUN_VALIDATOR_NODE
      userFeedback_runValidator_edge = this.createEdge(
        userFeedbackLoopNode,
        runValidatorNode
      )
    }

    // ADD CODE_RUNNER_STORE_NODE
    const storeNode_id = `STORE_${index}`
    const storeNode_Code = storeInputCode(field)
    const storeNode_xm = []
    if (hasLLmValidation) {
      storeNode_xm.push(`${llmValidatorNode['id']}.data.instance`)
      storeNode_xm.push(`${llmSkipNode['id']}.data.instance`)
    } else {
      storeNode_xm.push(`${runValidatorNode['id']}.data.instance`)
    }
    const storeNode = this.codeRunnerNode(
      storeNode_id,
      storeNode_Code,
      storeNode_xm
    )

    // EDGE between CODE_RUNNER_RUN_VALIDATOR_NODE -> CODE_RUNNER_STORE_NODE
    const runValidator_Store_edge = this.createEdge(
      hasLLmValidation ? llmValidatorNode : runValidatorNode,
      storeNode
    )

    // ERROR-EDGE between LLM_SKIP_NODE -> STORE_NODE
    let llmSkip_Store_error_edge
    if (hasLLmValidation) {
      llmSkip_Store_error_edge = this.createEdge(llmSkipNode, storeNode, true)
    }

    // create CODE_RUNNER_VALIDATION_NODE
    const validationNode_id = `VALIDATION_${index}`
    const validationNode_Code = ValidationMsg(field)
    const validationNode_xm = []
    validationNode_xm.push(`${storeNode['id']}.data.instance`)
    const validationNode = this.codeRunnerNode(
      validationNode_id,
      validationNode_Code,
      validationNode_xm
    )

    // ERROR-Edge between CODE_RUNNER_STORE_NODE -> CODE_RUNNER_VALIDATION_NODE
    const store_Validation_error_edge = this.createEdge(
      storeNode,
      validationNode,
      true
    )

    // Edge between CODE_RUNNER_VALIDATION_NODE -> USER_FEEDBACK_LOOP_NODE
    const validation_UserFeedback_edge = this.createEdge(
      validationNode,
      userFeedbackLoopNode
    )

    // UPDATE: UseFeedbackLoopNode's xMessage : Push validationNodeId to userFeedbackLoopNode's xMessage
    userFeedbackLoopNode['data']['inputs']['xmessage'].push(
      `${validationNode['id']}.data.instance`
    )

    // Push all nodes and edges to this.nodes and this.edges sequentially

    // push `isVisibleNode`
    this.nodes[isVisibleNode['id']] = isVisibleNode

    // push `askNode`
    this.nodes[askNode['id']] = askNode

    // push `edge isVisible_Ask_edge`
    this.edges.push(isVisible_Ask_edge)

    // push `llmAskNode`
    this.nodes[llmAskNode['id']] = llmAskNode

    // push `edge ask_llmAsk_edge`
    this.edges.push(ask_llmAsk_edge)

    // push `userFeedbackLoopNode`
    this.nodes[userFeedbackLoopNode['id']] = userFeedbackLoopNode

    // push `edge ask_UserFeedback_edge`
    this.edges.push(ask_UserFeedback_edge)

    if (hasLLmValidation) {
      // push `llmCurrentInputStoreNode`
      this.nodes[llmCurrentInputStoreNode['id']] = llmCurrentInputStoreNode

      // push `edge userFeedback_llmCurrentInputStore_edge`
      this.edges.push(userFeedback_llmCurrentInputStore_edge)

      // push `llmSkipNode`
      this.nodes[llmSkipNode['id']] = llmSkipNode

      // push `edge llmCurrentInputStore_llmSkip_edge`
      this.edges.push(llmCurrentInputStore_llmSkip_edge)

      // push `llmTransformerNode`
      this.nodes[llmTransformerNode['id']] = llmTransformerNode

      // push `edge llmSkip_llmTransformer_edge`
      this.edges.push(llmSkip_llmTransformer_edge)

      // push `llmValidatorNode`
      this.nodes[llmValidatorNode['id']] = llmValidatorNode

      // push `edge llmTransformer_llmValidator_edge`
      this.edges.push(llmTransformer_llmValidator_edge)
    } else {
      // push `runValidatorNode`
      this.nodes[runValidatorNode['id']] = runValidatorNode

      // push `edge userFeedback_runValidator_edge`
      this.edges.push(userFeedback_runValidator_edge)
    }

    // push `storeNode`
    this.nodes[storeNode['id']] = storeNode

    if (hasLLmValidation) {
      // push `edge llmValidator_Store_edge`
      this.edges.push(runValidator_Store_edge)
      // push `edge llmSkip_Store_error_edge`
      this.edges.push(llmSkip_Store_error_edge)
    } else {
      // push `edge runValidator_Store_edge`
      this.edges.push(runValidator_Store_edge)
    }
    // push `validationNode`
    this.nodes[validationNode['id']] = validationNode

    // push `edge store_Validation_error_edge`
    this.edges.push(store_Validation_error_edge)

    // push `edge validation_UserFeedback_edge`
    this.edges.push(validation_UserFeedback_edge)
  }

  /**
   * Creates a "Code Runner" transformer node
   * @param {*} id: id of the node
   * @param {*} code: for data.inputs.code
   * @param {*} xMessage: for data.inputs.xmessage
   * @returns
   */
  codeRunnerNode(id, code, xMessage) {
    const node = {
      id: `CODE_RUNNER_${id}`,
      data: {
        id: `CODE_RUNNER_${id}`,
        name: 'CODE_RUNNER',
        type: 'Output',
        label: 'Code Runner Transformer',
        inputs: {
          code: code,
          xmessage: xMessage,
        },
        outputs: {
          onError: '',
          onSuccess: '',
        },
        category: 'GenericTransformer',
        selected: false,
        baseClasses: ['xMessage'],
        description: 'A code runner capable of running custom JS code.',
        inputParams: [
          {
            id: `CODE_RUNNER_${id}-input-code-ide`,
            name: 'code',
            rows: 2,
            type: 'ide',
            label: 'Code',
          },
          {
            id: `CODE_RUNNER_${id}-input-sideEffects-json`,
            name: 'sideEffects',
            rows: 2,
            type: 'json',
            label: 'SideEffects',
          },
        ],
        inputAnchors: [
          {
            id: `CODE_RUNNER_${id}-input-xmessage-xMessage`,
            list: true,
            name: 'xmessage',
            type: 'xMessage',
            label: 'XMessage',
          },
        ],
        outputAnchors: [
          {
            id: `CODE_RUNNER_${id}-output-onSuccess-xMessage`,
            name: 'onSuccess',
            type: 'xMessage',
            label: 'On Success',
          },
          {
            id: `CODE_RUNNER_${id}-output-onError-xMessage`,
            name: 'onError',
            type: 'xMessage',
            label: 'On Error',
          },
        ],
      },
      type: 'customNode',
      width: 300,
      height: 569,
      dragging: false,
      position: {
        x: 3255.789032183661,
        y: -141.0959960862705,
      },
      selected: false,
      positionAbsolute: {
        x: 3255.789032183661,
        y: -141.0959960862705,
      },
      style: {},
    }
    return node
  }

  /**
   * Creates a "User Feedback Loop" node
   * @param {*} id: id of the node
   * @param {*} xMessage: for data.inputs.xmessage (optional)
   * @returns
   */
  userFeedbackLoopNode(id, xMessage) {
    const node = {
      id: `USER_FEEDBACK_LOOP_${id}`,
      data: {
        id: `USER_FEEDBACK_LOOP_${id}`,
        name: 'USER_FEEDBACK_LOOP',
        type: 'Output',
        label: 'User Feedback Loop',
        inputs: {
          xmessage: xMessage ? xMessage : [],
        },
        outputs: {
          restoreState: '',
        },
        category: 'StateRestoreTransformer',
        selected: false,
        baseClasses: ['xMessage'],
        description:
          'A transformer which restores state to a specific node after sending a message to user.',
        inputParams: [
          {
            id: `USER_FEEDBACK_LOOP_${id}-input-sideEffects-json`,
            name: 'sideEffects',
            rows: 2,
            type: 'json',
            label: 'SideEffects',
          },
        ],
        inputAnchors: [
          {
            id: `USER_FEEDBACK_LOOP_${id}-input-xmessage-xMessage`,
            list: true,
            name: 'xmessage',
            type: 'xMessage',
            label: 'XMessage',
          },
        ],
        outputAnchors: [
          {
            id: `USER_FEEDBACK_LOOP_${id}-output-restoreState-xMessage`,
            name: 'restoreState',
            type: 'xMessage',
            label: 'Restore State',
          },
        ],
      },
      type: 'customNode',
      width: 300,
      height: 569,
      dragging: false,
      position: {
        x: 3255.789032183661,
        y: -141.0959960862705,
      },
      selected: false,
      positionAbsolute: {
        x: 3255.789032183661,
        y: -141.0959960862705,
      },
      style: {},
    }
    return node
  }

  /**
   * Creates a "LLM Transformer" node
   * @param {*} id: id of the node
   * @param {*} xMessage: for data.inputs.xmessage
   * @param {*} description
   * @returns
   */
  llmTransformerNode(id, xMessage, description) {
    const APIKEY = process.env.OPENAI_API
    const apiKey = APIKEY || 'sk-proj-' // Replace with your actual OpenAI API key
    const model = 'gpt-4o-mini'
    // let prompt
    // if(hasPrompt){
    //   prompt = `You are an AI assistant who is helping a person fill out a conversational form. You are provided with the description of the question you have to ask to the user. Use the description to phrase and frame an empathetic question to be prompted to the user. The Description is ${description}`
    // }else{
    //   prompt = ''
    // }

    const node = {
      id: `LLM_${id}`,
      position: { x: 3988.7271438010634, y: -661.3071523540692 },
      type: 'customNode',
      data: {
        label: 'LLM Transformer',
        category: 'GenericTransformer',
        name: 'LLM',
        description: 'A general LLM model based transformer.',
        baseClasses: ['xMessage'],
        inputs: {
          xmessage: xMessage,
          APIKey: apiKey,
          model: model,
          prompt: '',
          corpusPrompt: '',
          temperature: '',
          enableStream: false,
          outputLanguage: '',
          outboundURL: '',
          bhashiniUserId: '',
          bhashiniAPIKey: '',
          bhashiniURL: '',
          provider: '',
          contextLength: '',
          languageProvider: '',
        },
        outputs: { onSuccess: '', onError: '' },
        inputAnchors: [
          {
            label: 'XMessage',
            name: 'xmessage',
            type: 'xMessage',
            list: true,
            id: `LLM_${id}-input-xmessage-xMessage`,
          },
        ],
        inputParams: [
          {
            label: 'API Key',
            name: 'APIKey',
            type: 'string',
            id: `LLM_${id}-input-APIKey-string`,
          },
          {
            label: 'Model',
            name: 'model',
            type: 'string',
            id: `LLM_${id}-input-model-string`,
          },
          {
            label: 'Prompt',
            name: 'prompt',
            type: 'string',
            id: `LLM_${id}-input-prompt-string`,
          },
          {
            label: 'Corpus Prompt',
            name: 'corpusPrompt',
            type: 'string',
            id: `LLM_${id}-input-corpusPrompt-string`,
          },
          {
            label: 'Temperature',
            name: 'temperature',
            type: 'number',
            id: `LLM_${id}-input-temperature-number`,
          },
          {
            label: 'Enable Stream',
            name: 'enableStream',
            type: 'boolean',
            id: `LLM_${id}-input-enableStream-boolean`,
          },
          {
            label: 'Output Language',
            name: 'outputLanguage',
            type: 'string',
            id: `LLM_${id}-input-outputLanguage-string`,
          },
          {
            label: 'Outbound URL',
            name: 'outboundURL',
            type: 'string',
            id: `LLM_${id}-input-outboundURL-string`,
          },
          {
            label: 'Bhashini User ID',
            name: 'bhashiniUserId',
            type: 'string',
            id: `LLM_${id}-input-bhashiniUserId-string`,
          },
          {
            label: 'Bhashini API Key',
            name: 'bhashiniAPIKey',
            type: 'string',
            id: `LLM_${id}-input-bhashiniAPIKey-string`,
          },
          {
            label: 'Bhashini URL',
            name: 'bhashiniURL',
            type: 'string',
            id: `LLM_${id}-input-bhashiniURL-string`,
          },
          {
            label: 'Provider',
            name: 'provider',
            type: 'string',
            id: `LLM_${id}-input-provider-string`,
          },
          {
            label: 'Context Length',
            name: 'contextLength',
            type: 'number',
            id: `LLM_${id}-input-contextLength-number`,
          },
          {
            label: 'Language Provider',
            name: 'languageProvider',
            type: 'string',
            id: `LLM_${id}-input-languageProvider-string`,
          },
          {
            id: `LLM_${id}-input-sideEffects-json`,
            label: 'SideEffects',
            name: 'sideEffects',
            rows: 2,
            type: 'json',
          },
        ],
        outputAnchors: [
          {
            id: `LLM_${id}-output-onSuccess-xMessage`,
            name: 'onSuccess',
            label: 'On Success',
            type: 'xMessage',
          },
          {
            id: `LLM_${id}-output-onError-xMessage`,
            name: 'onError',
            label: 'On Error',
            type: 'xMessage',
          },
        ],
        id: `LLM_${id}`,
        selected: false,
      },
      width: 300,
      height: 1690,
      selected: false,
      positionAbsolute: { x: 3988.7271438010634, y: -661.3071523540692 },
      dragging: false,
    }
    return node
  }

  /**
   * Connects two nodes using xMessage
   * @param {*} sourceId: source node Id
   * @param {*} targetId: target node Id
   */
  xMessageConnect(sourceId, targetId) {
    // push sourceId's instance to targetId's xMessage
    this.nodes[targetId].data.inputs.xmessage.push(`${sourceId}.data.instance`)
  }

  /**
   * Creates an edge between source and target
   * @param {*} source: source node
   * @param {*} target: target node
   * @param {*} error: boolean (default false), if true then edge uses sorce's `onError` output anchor
   * @returns
   */
  createEdge(source, target, error = false) {
    let sourceOutId
    if (error && source['data']['outputAnchors'].length > 1) {
      sourceOutId = source['data']['outputAnchors'][1]['id']
    } else {
      // console.log('source: ', source)
      sourceOutId = source['data']['outputAnchors'][0]['id']
    }
    const targetInId = target['data']['inputAnchors'][0]['id']

    const edgeId = `${source.id}-${target.id}`

    const edge = {
      id: edgeId,
      data: {
        label: '',
      },
      type: 'buttonedge',
      source: source.id,
      target: target.id,
      sourceHandle: sourceOutId,
      targetHandle: targetInId,
    }
    return edge
  }
}
