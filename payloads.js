const utils = require('./utils');

module.exports = {
    modal: context => {
        return {
            trigger_id: context.trigger_id,
            view: JSON.stringify({
                type: 'modal',
                title: {
                    type: 'plain_text',
                    text: 'More details about Idea'
                },
                callback_id: 'submit-ticket',
                submit: {
                    type: 'plain_text',
                    text: 'Submit'
                },
                blocks: [
                    {
                        block_id: 'title_block',
                        type: 'input',
                        label: {
                            type: 'plain_text',
                            text: 'Title'
                        },
                        element: {
                            action_id: 'title',
                            type: 'plain_text_input',
                            initial_value: utils.cleanUp(context.text)
                        },
                        hint: {
                            type: 'plain_text',
                            text: 'Short title of the idea'
                        }
                    },
                    {
                        block_id: 'description_block',
                        type: 'input',
                        label: {
                            type: 'plain_text',
                            text: 'Description'
                        },
                        element: {
                            action_id: 'description',
                            type: 'plain_text_input',
                            multiline: true
                        },
                        hint: {
                            type: 'plain_text',
                            text: '30 second summary of the idea'
                        },
                        optional: true
                    },
                    {
                        block_id: 'category_block',
                        type: 'input',
                        label: {
                            type: 'plain_text',
                            text: 'Category'
                        },
                        element: {
                            action_id: 'category',
                            type: 'static_select',
                            options: [
                                {
                                    text: {
                                        type: "plain_text",
                                        text: "Product"
                                    },
                                    value: "1"
                                },
                                {
                                    text: {
                                        type: "plain_text",
                                        text: "Process"
                                    },
                                    value: "2"
                                },
                                {
                                    text: {
                                        type: "plain_text",
                                        text: "Technology"
                                    },
                                    value: "3"
                                },
                                {
                                    text: {
                                        type: "plain_text",
                                        text: "Culture"
                                    },
                                    value: "4"
                                }
                            ]
                        },
                        optional: false
                    },
                    {
                        block_id: 'anonymous_block',
                        type: 'input',
                        label: {
                            type: 'plain_text',
                            text: 'Make feedback anonymous?'
                        },
                        element: {
                            action_id: 'anonymous',
                            type: 'static_select',
                            options: [
                                {
                                    text: {
                                        type: "plain_text",
                                        text: "Yes"
                                    },
                                    value: "Yes"
                                },
                                {
                                    text: {
                                        type: "plain_text",
                                        text: "No"
                                    },
                                    value: "No"
                                }
                            ]
                        },
                        optional: false
                    }
                ]
            })
        }
    }
}