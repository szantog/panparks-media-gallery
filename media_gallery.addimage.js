(function ($) {

Drupal.behaviors.media_gallery = {};
Drupal.behaviors.media_gallery.attach = function (context, settings) {
  // Bind a click handler to the 'add images' link.
  $('a.media-gallery-add.launcher').once('media-gallery-add-processed').bind('click', Drupal.media_gallery.open_browser);
};

Drupal.media_gallery = {};

Drupal.media_gallery.open_browser = function (event) {
  event.preventDefault();
  var pluginOptions = { 'id': 'media_gallery', 'multiselect' : true , 'types': ['image']};
  Drupal.media.popups.mediaBrowser(Drupal.media_gallery.add_images, pluginOptions);
};

Drupal.media_gallery.add_images = function (mediaFiles) {
  // TODO AN-17966: Add the images to the node's media multifield on the client
  // side instead of reloading the page.
  var imagesAdded = function (returnedData, textStatus, XMLHttpRequest) {
    parent.window.location.reload();
  };

  var errorCallback = function () {
    //console.warn('Error: Images not added.');
  };

  var src = Drupal.settings.basePath + 'media-gallery/add-images/' + Drupal.settings.mediaGalleryNid + '/' + Drupal.settings.mediaGalleryToken;

  var media = [];

  for(var i = 0; i < mediaFiles.length; i++) {
    media[i] = mediaFiles[i].fid;
  }

  $.ajax({
    url: src,
    type: 'POST',
    dataType: 'json',
    data: {files: media},
    error: errorCallback,
    success: imagesAdded
  });
  
  return false;
}

})(jQuery);
