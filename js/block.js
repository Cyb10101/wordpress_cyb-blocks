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

const CybEntityRecordsDropdownControl = wp.compose.compose(
    withSelect(function (select, props) {
        let postTypeAllowed = ['post', 'page'];
        let postType = postTypeAllowed[0];
        if (props.hasOwnProperty('postType') && postTypeAllowed.includes(postType)) {
            postType = props.postType;
        }
        return {
            posts: select('core').getEntityRecords('postType', postType),
        }
    })
)(function (props) {
    let options = [];

    if (props.posts) {
        if (props.hasOwnProperty('options') && props.options.length > 0) {
            options = props.options;
        } else {
            if (props.posts.length > 0) {
                options.push({value: 0, label: __('-- Select a entry --')});
            } else {
                options.push({value: 0, label: __('No entries')});
            }
        }

        if (props.posts.length > 0) {
            props.posts.forEach((post) => {
                options.push({value: post.id, label: post.title.rendered});
            });
        }
    } else {
        options.push({value: 0, label: __('Loading...')})
    }

    return createElement('div', {
        style: {'display': 'flex'}
    }, [
        createElement(SelectControl, {
            label: props.label || __('Select a entry'),
            options: options,
            onChange: props.onChange || function (content) {
                console.error('Method \'onChange\' not set!');
            },
            value: props.value
        })
    ]);
});

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
            name = name.replace(/[^a-zA-Z0-9-_]/g, '');
            props.setAttributes({name});
        }

        return createElement('div', null, [
            createElement('div', {
                className: 'preview-x',
                style: {'display': 'flex'}
            }, [
                createElement('div', {
                    style: {'flex': '0 0 auto'}
                }, [
                    createElement('span', {
                        className: 'dashicons dashicons-editor-code',
                        style: {'font-size': '18px', 'vertical-align': 'middle'}
                    }),
                    'Anker #'
                ]),
                createElement(TextControl, {
                    tagName: 'div',
                    placeholder: __('name'),
                    // help: __('The name without hash and whitespace, preferably lowercase. [a-z A-Z 0-9 -_]'),
                    value: props.attributes.name,
                    onChange: updateName,
                    style: {flex: '1 0 auto', border: '1px solid grey;'}
                }),
            ]),
            createElement('span', {
                className: 'hide-not-selected',
                style: {color: 'rgb(117, 117, 117)', 'font-size': '13px'}
            }, __('The name without hash and whitespace, preferably lowercase. [a-z A-Z 0-9 -_]')),
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

registerBlockType('cyb/featured-content', {
    title: 'Featured Content',
    icon: 'megaphone',
    category: 'widgets',
    attributes: {
        postsAmount: {type: 'int', default: 3},
        fixedHeight: {type: 'int', default: 0},
        post1: {type: 'int', default: 0},
        post2: {type: 'int', default: 0},
        post3: {type: 'int', default: 0},
        page1: {type: 'int', default: 0},
        page2: {type: 'int', default: 0},
        page3: {type: 'int', default: 0},
    },
    edit: function (props) {
        function updatePostsAmount(postsAmount) {
            props.setAttributes({postsAmount});
        }
        function updateFixedHeight(fixedHeight) {
            props.setAttributes({fixedHeight});
        }
        function updatePost1(post1) {
            props.setAttributes({post1});
        }
        function updatePost2(post2) {
            props.setAttributes({post2});
        }
        function updatePost3(post3) {
            props.setAttributes({post3});
        }
        function updatePage1(page1) {
            props.setAttributes({page1});
        }
        function updatePage2(page2) {
            props.setAttributes({page2});
        }
        function updatePage3(page3) {
            props.setAttributes({page3});
        }

        return createElement('div', {

        }, [
            createElement(InspectorControls, null,
                createElement(PanelBody, {
                    title: __('Configuration'),
                    initialOpen: true
                }, [
                    createElement(RangeControl, {
                        label: 'Posts amount',
                        min: 0,
                        max: 10,
                        value: props.attributes.postsAmount,
                        onChange: updatePostsAmount
                    }),
                    createElement(RangeControl, {
                        label: 'Fixed height',
                        min: 0,
                        max: 999,
                        value: props.attributes.fixedHeight,
                        onChange: updateFixedHeight
                    }),
                    createElement(CybEntityRecordsDropdownControl, {
                        value: props.attributes.post1,
                        label: __('Featured Post 1'),
                        onChange: updatePost1,
                        options: [
                            {value: '0', label: '-- ' + __('Please select an option.') + ' --'},
                        ]
                    }),
                    createElement(CybEntityRecordsDropdownControl, {
                        value: props.attributes.post2,
                        label: __('Featured Post 2'),
                        onChange: updatePost2,
                        options: [
                            {value: '0', label: '-- ' + __('Please select an option.') + ' --'},
                        ]
                    }),
                    createElement(CybEntityRecordsDropdownControl, {
                        value: props.attributes.post3,
                        label: __('Featured Post 3'),
                        onChange: updatePost3,
                        options: [
                            {value: '0', label: '-- ' + __('Please select an option.') + ' --'},
                        ]
                    }),
                    createElement(CybEntityRecordsDropdownControl, {
                        postType: 'page',
                        value: props.attributes.page1,
                        label: __('Featured Page 1'),
                        onChange: updatePage1,
                        options: [
                            {value: '0', label: '-- ' + __('Please select an option.') + ' --'},
                        ]
                    }),
                    createElement(CybEntityRecordsDropdownControl, {
                        postType: 'page',
                        value: props.attributes.page2,
                        label: __('Featured Page 2'),
                        onChange: updatePage2,
                        options: [
                            {value: '0', label: '-- ' + __('Please select an option.') + ' --'},
                        ]
                    }),
                    createElement(CybEntityRecordsDropdownControl, {
                        postType: 'page',
                        value: props.attributes.page3,
                        label: __('Featured Page 3'),
                        onChange: updatePage3,
                        options: [
                            {value: '0', label: '-- ' + __('Please select an option.') + ' --'},
                        ]
                    }),
                ])
            ),
            createElement(wp.serverSideRender, {
                block: 'cyb/featured-content',
                attributes: props.attributes
            })
        ]);
    },
});