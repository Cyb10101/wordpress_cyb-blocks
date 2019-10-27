<?php
/*
Plugin Name: Cyb Blocks
Plugin URI: https://github.com/Cyb10101/wordpress_cyb-blocks/
Description: Blocks plugin
Author: Thomas Schur
Version: 1.0.0
Author URI: https://cyb10101.de/
*/

class CybBlocks {
    public function initialize() {
        add_action('enqueue_block_assets', [$this, 'enqueueBlockAssets']);
        add_action('enqueue_block_editor_assets', [$this, 'enqueueBlockEditorAssets']);
        add_action('wp_enqueue_scripts', [$this, 'enqueueScripts']);
    }

    public function enqueueBlockAssets() {
        wp_enqueue_style('cyb-block', plugins_url('css/block.css', __FILE__), [], false);
    }

    public function enqueueBlockEditorAssets() {
        wp_enqueue_script('cyb-gallery', plugin_dir_url(__FILE__) . 'js/block.js',
            [
                'wp-blocks',
                'wp-editor',
                'wp-i18n',
                'wp-element',
                'wp-components',
            ],
            true
        );
    }

    public function enqueueScripts() {
        if (!is_admin()) {
            wp_deregister_script('jquery');
            wp_register_script('jquery', get_template_directory_uri() . '/includes/jquery.min.js', false);
            wp_enqueue_script('jquery');

            wp_enqueue_style('fancybox', plugins_url('css/jquery.fancybox.min.css', __FILE__), [], false);
            wp_enqueue_script('fancybox', plugins_url('js/jquery.fancybox.min.js', __FILE__), ['jquery'], false, true);

            wp_enqueue_style('cyb-blocks-frontend', plugins_url('css/frontend.css', __FILE__), [], false);
            wp_enqueue_script('cyb-blocks-frontend', plugins_url('js/frontend.js', __FILE__), ['jquery'], false, true);
        }
    }
}

$cybBlocks = new CybBlocks();
$cybBlocks->initialize();
