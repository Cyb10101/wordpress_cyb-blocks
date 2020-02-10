// Gutenberg block
const {registerBlockType, registerBlockStyle, createBlock} = wp.blocks; // Blocks API
const {createElement} = wp.element; // React.createElement
const {InspectorControls, RichText} = wp.blockEditor;
const {__} = wp.i18n; // Translation functions
const {BaseControl, Button, TextControl, TextareaControl, SelectControl, ToggleControl, RangeControl, PanelBody} = wp.components;
const {withSelect, withDispatch} = wp.data;

/**
 * Generate a random string
 *
 * @param {int} length
 * @param {string} characters
 * @return {string}
 */
function generateRandomString(length = 12, characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-') {
    let string = '';
    for (let i = 0; i < length; i++) {
        string += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return string;
}

/**
 * Get current date (YYYY-mm-dd)
 *
 * @returns {string}
 */
function getDateYmd() {
    let date = new Date();
    return date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
}

// https://fontawesome.com/icons/sync?style=solid
const iconReload = createElement('svg', {width: 15, height: 15,  viewBox: '0 0 512 512', style: {'margin-top': '5px'}}, [
    createElement('path', {d: 'M440.65 12.57l4 82.77A247.16 247.16 0 0 0 255.83 8C134.73 8 33.91 94.92 12.29 209.82A12 12 0 0 0 24.09 224h49.05a12 12 0 0 0 11.67-9.26 175.91 175.91 0 0 1 317-56.94l-101.46-4.86a12 12 0 0 0-12.57 12v47.41a12 12 0 0 0 12 12H500a12 12 0 0 0 12-12V12a12 12 0 0 0-12-12h-47.37a12 12 0 0 0-11.98 12.57zM255.83 432a175.61 175.61 0 0 1-146-77.8l101.8 4.87a12 12 0 0 0 12.57-12v-47.4a12 12 0 0 0-12-12H12a12 12 0 0 0-12 12V500a12 12 0 0 0 12 12h47.35a12 12 0 0 0 12-12.6l-4.15-82.57A247.17 247.17 0 0 0 255.83 504c121.11 0 221.93-86.92 243.55-201.82a12 12 0 0 0-11.8-14.18h-49.05a12 12 0 0 0-11.67 9.26A175.86 175.86 0 0 1 255.83 432z'})
]);

registerBlockStyle('core/gallery', {
    name: 'cyb-gallery-fancybox',
    label: 'Fancybox'
});

registerBlockType('cyb/anker', {
    title: 'Anker',
    icon: {src: 'admin-links', foreground: '#0099CC'},
    category: 'formatting',
    attributes: {
        name: {type: 'string'},
    },
    transforms: {
        from: [{
            type: 'block',
            blocks: ['core/html'],
            isMatch: function isMatch(attributes) {
                let htmlContent = document.createElement('div');
                if (!attributes.hasOwnProperty('content')) {
                    return true; // Empty content is all right
                }
                htmlContent.innerHTML = attributes.content.trim();

                return (
                    htmlContent.firstChild.tagName.toLowerCase() === 'a'
                    && htmlContent.firstChild.getAttribute('name') !== null
                    && htmlContent.firstChild.getAttribute('href') === null
                );
            },
            transform: function (attributes) {
                let name = '';
                let htmlContent = document.createElement('div');
                if (attributes.hasOwnProperty('content')) {
                    htmlContent.innerHTML = attributes.content.trim();
                    name = htmlContent.firstChild.getAttribute('name');
                }

                return createBlock('cyb/anker', {
                    name: name,
                });
            },
        }],
        to: [{
            type: 'block',
            blocks: ['core/html'],
            transform: function (attributes) {
                let htmlAnker = document.createElement('a');
                htmlAnker.setAttribute('name', attributes.name);

                return createBlock('core/html', {
                    content: htmlAnker.outerHTML
                });
            }
        }]
    },
    edit: function (props) {
        function updateName(name) {
            props.setAttributes({name})
        }

        return createElement('div', null, [
            createElement('div', {
                className: 'preview-x',
            }, [
                createElement('span', {
                    className: 'dashicons dashicons-editor-code',
                    style: {'font-size': '18px', 'vertical-align': 'middle'}
                }),
                'Anker #' + props.attributes.name,
            ]),
            createElement(TextControl, {
                className: 'hide-not-selected',
                type: 'text',
                label: __('Anker name'),
                help: __('The name without hash.'),
                value: props.attributes.name,
                onChange: updateName
            }),
        ]);
    },
    save: function (props) {
        return createElement('a', {
            name: props.attributes.name
        });
    }
});

registerBlockType('cyb/alert', {
    title: 'Alert',
    icon: {src: 'warning', foreground: '#0099CC'},
    category: 'common',
    attributes: {
        id: {
            type: 'string',
            // default: generateRandomString(),
        },
        type: {
            type: 'string',
            default: 'danger',
        },
        dismissible: {
            type: 'bool',
            default: true,
        },
        message: {
            type: 'string',
            source: 'html',
            selector: 'div.message',
        },
    },

    edit: function (props) {
        function generateId() {
            let newId = getDateYmd() + '_' + generateRandomString(10);
            props.setAttributes({id: newId});
        }
        function updateId(id) {
            props.setAttributes({id});
        }
        function updateType(type) {
            props.setAttributes({type});
        }
        function updateDismissible(dismissible) {
            props.setAttributes({dismissible});
        }
        function updateMessage(message) {
            props.setAttributes({message});
        }

        if (!props.attributes.id || typeof props.attributes.id === 'undefined') {
            generateId();
        }

        return createElement('div', {

        }, [
            createElement(InspectorControls, null,
                createElement(PanelBody, {
                    title: __('Configuration'),
                    initialOpen: true
                }, [
                    createElement(ToggleControl, {
                        label: 'Dismissible',
                        checked: props.attributes.dismissible,
                        onChange: updateDismissible
                    }),
                    createElement(BaseControl, {
                        label: __('id'),
                        help: __('The id for dismissible script.'),
                    }, [
                        createElement('input', {
                            type: 'text',
                            value: props.attributes.id,
                            onChange: updateId
                        }),
                        createElement(Button, {
                            isDefault: true,
                            isLarge: true,
                            title: 'Generate new id',
                            onClick: generateId
                        }, [iconReload]),
                    ])
                ])
            ),
            createElement('div', {
                className: 'wp-block-cyb-alert alert alert-' + props.attributes.type + (props.attributes.dismissible ? ' alert-dismissible fade show' : ''),
                role: 'alert'
            }, [
                createElement('div', {
                    className: 'message',
                }, [
                    createElement(RichText, {
                        tagName: 'div',
                        placeholder: __('Message'),
                        value: props.attributes.message,
                        onChange: updateMessage
                    })
                ]),
                !props.attributes.dismissible || createElement('button', {
                    type: 'button',
                    className: 'close',
                    'data-dismiss': 'alert',
                    'aria-label': 'Close'
                }, [
                    createElement('span', {
                        'aria-hidden': 'true',
                    }, '×')
                ])
            ]),
            createElement(SelectControl, {
                className: 'hide-not-selected',
                value: props.attributes.type,
                label: __('Type'),
                onChange: updateType,
                options: [
                    {value: 'danger', label: __('Danger')},
                    {value: 'warning', label: __('Warning')},
                    {value: 'success', label: __('Success')},
                    {value: 'info', label: __('Info')},
                ]
            }),
        ]);
    },

    save: function (props) {
        return createElement('div', {
            id: 'cyb-alert_' + props.attributes.id,
            className: 'alert alert-' + props.attributes.type + (props.attributes.dismissible ? ' alert-dismissible fade show' : ''),
            role: 'alert'
        }, [
            createElement('div', {
                className: 'message',
                dangerouslySetInnerHTML: {__html: props.attributes.message}
            }),
            !props.attributes.dismissible || createElement('button', {
                type: 'button',
                className: 'close',
                'data-dismiss': 'alert',
                'aria-label': 'Close'
            }, [
                createElement('span', {
                    'aria-hidden': 'true',
                }, '&times;')
            ])
        ]);
    },
});
