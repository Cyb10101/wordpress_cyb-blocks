<?php
/*
Plugin Name: Cyb Blocks
Plugin URI: https://github.com/Cyb10101/wordpress_cyb-blocks
Description: Blocks plugin
Author: Thomas Schur
Version: 1.0.4
Author URI: https://cyb10101.de/
*/

class CybBlocks {
    public function initialize() {
        add_action('enqueue_block_assets', [$this, 'enqueueBlockAssets']);
        add_action('enqueue_block_editor_assets', [$this, 'enqueueBlockEditorAssets']);
        add_action('wp_enqueue_scripts', [$this, 'enqueueScripts']);
        add_action('init', [$this, 'wpInit']);
    }

    public function wpInit() {
        $this->gutenbergDynamic();
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
            wp_register_script('jquery', plugins_url('js/jquery.min.js', __FILE__), false);
            wp_enqueue_script('jquery');

            wp_enqueue_style('fancybox', plugins_url('css/jquery.fancybox.min.css', __FILE__), [], false);
            wp_enqueue_script('fancybox', plugins_url('js/jquery.fancybox.min.js', __FILE__), ['jquery'], false, true);

            wp_enqueue_style('cyb-blocks-frontend', plugins_url('css/frontend.css', __FILE__), [], false);
            wp_enqueue_script('cyb-blocks-frontend', plugins_url('js/frontend.js', __FILE__), ['jquery'], false, true);
        }
    }

    public function gutenbergDynamic() {
        // automatically load dependencies and version
//        $asset_file = include(plugin_dir_path(__FILE__) . 'build/index.asset.php');

//        wp_register_script(
//            'gutenberg-examples-dynamic',
//            plugins_url('build/block.js', __FILE__),
//            $asset_file['dependencies'],
//            $asset_file['version']
//        );

        register_block_type('cyb/featured-content', [
            'editor_script' => 'cyb-block-featured-content',
            'render_callback' => [$this, 'blockDynamicFeaturedContent'],
            'attributes' => [
                'postsAmount' => ['type' => 'integer', 'default' => 3],
                'fixedHeight' => ['type' => 'integer', 'default' => 0],
                'post1' => ['type' => 'integer', 'default' => 0],
                'post2' => ['type' => 'integer', 'default' => 0],
                'post3' => ['type' => 'integer', 'default' => 0],
                'page1' => ['type' => 'integer', 'default' => 0],
                'page2' => ['type' => 'integer', 'default' => 0],
                'page3' => ['type' => 'integer', 'default' => 0],
            ],
        ]);
    }

    public function blockDynamicFeaturedContent($attributes, $content) {
        $content = '';
        $posts = [];

        if (!($attributes['postsAmount'] >= 0 && $attributes['postsAmount'] <= 10)) {
            $attributes['postsAmount'] = 3;
        }
        if (!($attributes['fixedHeight'] >= 0 && $attributes['fixedHeight'] <= 999)) {
            $attributes['fixedHeight'] = 0;
        }

        $featuredPosts = [
            $attributes['post1'],
            $attributes['post2'],
            $attributes['post3'],
            $attributes['page1'],
            $attributes['page2'],
            $attributes['page3'],
        ];
        foreach ($featuredPosts as $postId) {
            if ($postId > 0) {
                $post = get_post($postId);
                if ($post instanceof \WP_Post) {
                    $posts[] = $post;
                }
            }
        }

        $excludePostIds = [];
        if ($posts > 0) {
            foreach ($posts as $post) {
                $excludePostIds[] = $post->ID;
            }
        }

        if ($attributes['postsAmount'] > 0) {
            $recentPosts = wp_get_recent_posts([
                'numberposts' => $attributes['postsAmount'],
                'post_status' => 'publish',
                'exclude' => $excludePostIds,
            ], OBJECT);
            /** @var \WP_Post $post */
            foreach ($recentPosts as $post) {
                $posts[] = $post;
            }
        }

        $content .= $this->getRenderedFeatureContent($posts, $attributes['fixedHeight']);
        return '<div class="wp-block-cyb-featured-content">' . $content . '</div>';
    }

    protected function getRenderedFeatureContent($posts, $fixedHeight = 0) {
        $content = '';
        if (count($posts) > 0) {
            $content .= '<div class="row">';
            /** @var \WP_Post $post */
            foreach ($posts as $post) {
                $excerpt = wp_trim_words(get_the_excerpt($post->ID), 10);

                $styleImage = $fixedHeight > 0 ? 'object-fit: cover; height: ' . $fixedHeight . 'px;' : '';
                ob_start();
                ?>
                <div class="col-xl-4 col-lg-6 col-md-6 col-sm-6 mb-4 d-flex align-items-stretch">
                    <div class="card flex-fill">
                        <a href="<?php echo get_permalink($post->ID); ?>" class="card-linked">
                            <?php if (has_post_thumbnail($post)) {
                                echo get_the_post_thumbnail($post, [256, 0], ['class' => 'card-img-top', 'style' => $styleImage]);
                            } ?>
                            <div class="card-body">
                                <h5 class="card-title"><?php echo esc_html($post->post_title); ?></h5>
                                <p class="card-text"><?php echo $excerpt; ?></p>
                            </div>
                        </a>
                    </div>
                </div>
                <?php
                $content .= ob_get_clean();
            }
            $content .= '</div>';
        }
        return $content;
    }
}

$cybBlocks = new CybBlocks();
$cybBlocks->initialize();

if (is_admin()) {
    require_once('src/Utility/PluginUpdaterUtility.php');
    new \Cyb\Utility\PluginUpdaterUtility(__FILE__);
}
