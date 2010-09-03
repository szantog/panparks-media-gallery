(function ($) {

Drupal.behaviors.media_gallery_form = {};
Drupal.behaviors.media_gallery_form.attach = function (context, settings) {

  // Create an object to store the options that will toggle.  Storing it as a
  // var so we only have to create the object once.
  var toggleOptions = $('#edit-settings-wrapper .hidden', context).not('.media-gallery-show');
  // Store the text strings for the link here so we don't call Drupal.t()
  // every click.
  toggleOptions.moreText = Drupal.t('More settings');
  toggleOptions.lessText = Drupal.t('Fewer settings');

  // Add a toggle link after the visible options in the fieldset.
  var $visible = $('.media-gallery-show:last', context);
  if ($visible.length) {
    var moreLink = $('<a></a>')
      .attr('href','#')
      .html(toggleOptions.moreText)
      .bind('click', toggleOptions, Drupal.media_gallery_form.more_settings);
    $visible.after(moreLink);
  }

  // Hide the additional options.
  toggleOptions.hide();

  // Change the "Presentation settings" image to match the radio buttons.
  var radios = $('.field-name-media-gallery-format .form-type-radio input', context).once('lightbox-format-select');
  if (radios.length) {
    radios.bind('change', Drupal.media_gallery_form.format_select);
    Drupal.media_gallery_form.format_select();
  }

  // Enhance the image count textfields with a select dropdown.
  $('.media-gallery-dropdown input', context).once('media-gallery-form', Drupal.media_gallery_form.create_dropdown);

};

Drupal.media_gallery_form = {};

/**
 * Click handler for the "More settings" link.
 */
Drupal.media_gallery_form.more_settings = function (event) {
  // Stop the link tag from affecting the page location.
  event.preventDefault();

  // Toggle the fields and the link text.
  event.data.toggle();
  var $link = $(this);
  if ($link.html() == event.data.moreText) {
    $link.html(event.data.lessText);
  } else {
    $link.html(event.data.moreText);
  }
}

/**
 * Change handler for the gallery format radio buttons.
 * 
 * Changes the image next to "Presentation settings" to match the image next
 * to the currently selected gallery format radio button.
 */
Drupal.media_gallery_form.format_select = function (event) {
  var $selected = $('#edit-media-gallery-format-und :radio:checked').siblings('label').find('.setting-icon');
  var classes = $selected.attr('class');
  $('.presentation-settings > .setting-icon').attr('class', classes);
}

/**
 * Click handler for the "More settings" link.
 */
Drupal.media_gallery_form.create_dropdown = function () {
  var $textfield = $(this);
  var textfield_value = $textfield.val();
  // The list of options comes from a JavaScript setting associated with this
  // form element. The list is expected to include 'other' (which means the
  // textarea will not be hidden).
  var parent_id = $textfield.closest('.media-gallery-dropdown').attr('id');
  var options = Drupal.settings.media_gallery_dropdown_options[parent_id];
  var $dropdown = $("<select/>").addClass('form-select enhanced');
  var i;
  var selected = false;
  for (i = 0; i < options.length; i++) {
    var option = options[i];
    var option_html = '<option value="' + option + '"';
    // Make sure the appropriate value is selected. We default to selecting
    // 'other' if nothing else matches.
    if (option == textfield_value || (selected === false && option == 'other')) {
      option_html += ' selected="selected"';
      selected = i;
    }
    option_html += '>' + option + '</option>';
    $dropdown.append($(option_html));
  }
  $textfield.before($dropdown);
  $dropdown.bind('change', {'textfield_id': $textfield.attr('id')}, Drupal.media_gallery_form.select_handler);
  // Hide the textfield unless 'other' is selected.
  if (options[selected] != 'other') {
    $textfield.hide();
  }
};

/**
 * Change handler for dropdowns added to text fields.
 */
Drupal.media_gallery_form.select_handler = function (event) {
  var $textfield = $('#' + event.data.textfield_id);
  var selected = $(this).val();
  if (selected === 'other') {
    $textfield.val('');
    $textfield.show();
  }
  else {
    $textfield.val(selected.toString());
    $textfield.hide();
  }
};


})(jQuery);
