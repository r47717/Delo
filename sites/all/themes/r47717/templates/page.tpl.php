<?php

/**
 * @file
 * Default theme implementation to display a single Drupal page.
 *
 * The doctype, html, head and body tags are not in this template. Instead they
 * can be found in the html.tpl.php template in this directory.
 *
 * Available variables:
 *
 * General utility variables:
 * - $base_path: The base URL path of the Drupal installation. At the very
 *   least, this will always default to /.
 * - $directory: The directory the template is located in, e.g. modules/system
 *   or themes/bartik.
 * - $is_front: TRUE if the current page is the front page.
 * - $logged_in: TRUE if the user is registered and signed in.
 * - $is_admin: TRUE if the user has permission to access administration pages.
 *
 * Site identity:
 * - $front_page: The URL of the front page. Use this instead of $base_path,
 *   when linking to the front page. This includes the language domain or
 *   prefix.
 * - $logo: The path to the logo image, as defined in theme configuration.
 * - $site_name: The name of the site, empty when display has been disabled
 *   in theme settings.
 * - $site_slogan: The slogan of the site, empty when display has been disabled
 *   in theme settings.
 *
 * Navigation:
 * - $main_menu (array): An array containing the Main menu links for the
 *   site, if they have been configured.
 * - $secondary_menu (array): An array containing the Secondary menu links for
 *   the site, if they have been configured.
 * - $breadcrumb: The breadcrumb trail for the current page.
 *
 * Page content (in order of occurrence in the default page.tpl.php):
 * - $title_prefix (array): An array containing additional output populated by
 *   modules, intended to be displayed in front of the main title tag that
 *   appears in the template.
 * - $title: The page title, for use in the actual HTML content.
 * - $title_suffix (array): An array containing additional output populated by
 *   modules, intended to be displayed after the main title tag that appears in
 *   the template.
 * - $messages: HTML for status and error messages. Should be displayed
 *   prominently.
 * - $tabs (array): Tabs linking to any sub-pages beneath the current page
 *   (e.g., the view and edit tabs when displaying a node).
 * - $action_links (array): Actions local to the page, such as 'Add menu' on the
 *   menu administration interface.
 * - $feed_icons: A string of all feed icons for the current page.
 * - $node: The node object, if there is an automatically-loaded node
 *   associated with the page, and the node ID is the second argument
 *   in the page's path (e.g. node/12345 and node/12345/revisions, but not
 *   comment/reply/12345).
 *
 * Regions:
 * - $page['help']: Dynamic help text, mostly for admin pages.
 * - $page['content']: The main content of the current page.
 * - $page['sidebar']: Items for the first sidebar.
 * - $page['header']: Items for the header region.
 * - $page['footer']: Items for the footer region.
 * - $page['footer1']: Items for the footer region.
 * - $page['footer2']: Items for the footer region.
 * - $page['footer3']: Items for the footer region.
 *
 * @see template_preprocess()
 * @see template_preprocess_page()
 * @see template_process()
 * @see html.tpl.php
 *
 * @ingroup themeable
 */
?>

  <div id="page-wrapper"><div id="page">

    <div id="header"><div class="section clearfix">

      <?php if ($logo): ?>
        <div id="logo-img" class="cleafix">
          <a href="<?php print $front_page; ?>" title="<?php print t('Home'); ?>" rel="home" id="logo">
            <img src="<?php print $logo; ?>" alt="<?php print t('Home'); ?>" />
          </a>
        </div>
      <?php endif; ?>

      <?php if ($site_name || $site_slogan): ?>
        <div id="name-and-slogan">
          <?php if ($site_name): ?>
            <div id="site-name">
              <a href="<?php print $front_page; ?>" title="<?php print t('Home'); ?>" rel="home"><span><?php print $site_name; ?></span></a>
            </div>
          <?php endif; ?>

          <?php if ($site_slogan): ?>
            <div id="site-slogan"><?php print $site_slogan; ?></div>
          <?php endif; ?>
        </div> <!-- /#name-and-slogan -->
      <?php endif; ?>

      <div id="header-region">
        <?php print render($page['header']); ?>
      </div>

    </div></div> <!-- /.section, /#header -->

    <div id="messages">
      <?php print $messages; ?>
    </div>

    <?php if ($page['sidebar']): ?>
      <div id="sidebar">
        <div class="section clearfix">
          <?php print render($page['sidebar']); ?>
        </div> 
      </div>
    <?php endif; ?>

    <div id="content">
      <div class="section clearfix">
        <a name='title-anchor'></a>
        <?php print render($title_prefix); ?>
        <?php if ($title): ?><h1 class="title" id="page-title"><?php print $title; ?></h1><?php endif; ?>
        <?php print render($title_suffix); ?>
        <?php if ($tabs): ?><div class="tabs"><?php print render($tabs); ?></div><?php endif; ?>
        <?php print render($page['help']); ?>
        <?php if ($action_links): ?><ul class="action-links"><?php print render($action_links); ?></ul><?php endif; ?>
        <?php print render($page['content']); ?>
        <?php print $feed_icons; ?>
      </div>
    </div>

    <div id="footer">
      <div id="footer1">
        <div class="section">
          <?php print render($page['footer1']); ?>
        </div>
      </div>
      <div id="footer2">
        <div class="section">
          <?php print render($page['footer2']); ?>
        </div>
      </div>
      <div id="footer3">
        <div class="section">
          <div>
            <?php print render($page['footer3']); ?>
            <?php
              echo l('link', '/link', [
                'attributes' => [
                  'class' => [
                    'use-ajax',
                  ]
                ],
              ]);
            ?>
          </div>
        </div>
      </div>
    </div>

  </div></div> <!-- /#page, /#page-wrapper -->

  <script type="text/template" id="edit-task-popup-template">
    <div id='edit-dialog' title='<%- title %>'>
      <input type='textfield' id='task-edit-title' value ='<%- title %>'>
      <textarea rows='5' id='task-edit-descr'><%- description %></textarea>
      <select id='task-edit-status'>
        <% _.each(statuses, function(status) { %>
          <option><%= status %></option>
        <% }); %>
      </select>
      <input type='button' name='task-edit-save' value='Сохранить'>
      <input type='button' name='task-edit-cancel' value='Отменить'>
      <input type='button' name='task-edit-delete' value='Удалить'>
    </div>
  </script>