var currentPage = 1; // Track current page

    // Function to show items for the selected page
    function showPage(pageNumber) {
        // Hide all list items
        $('#project-list li').hide();

        // Calculate the start and end index for the current page
        var startIndex = (pageNumber - 1) * 10;
        var endIndex = startIndex + 9;

        // Show list items within the range
        $('#project-list li').slice(startIndex, endIndex + 1).show();

        // Update current page
        currentPage = pageNumber;

        // Update page number displayed
        $('#page-number').text(pageNumber);
    }

    // Function to show the previous page
    function prevPage() {
        if (currentPage > 1) {
            showPage(currentPage - 1);
        }
    }

    // Function to show the next page
    function nextPage() {
        var totalPages = Math.ceil($('#project-list li').length / 10);
        if (currentPage < totalPages) {
            showPage(currentPage + 1);
        }
    }

    // Initially show the first page
    $(document).ready(function() {
        showPage(1);
    });

	/*Upcoming work js*/
	class Accordion {
		constructor(el) {
		  // Store the <details> element
		  this.el = el;
		  // Store the <summary> element
		  this.summary = el.querySelector('summary');
		  // Store the <div class="content"> element
		  this.content = el.querySelector('.content');
	  
		  // Store the animation object (so we can cancel it if needed)
		  this.animation = null;
		  // Store if the element is closing
		  this.isClosing = false;
		  // Store if the element is expanding
		  this.isExpanding = false;
		  // Detect user clicks on the summary element
		  this.summary.addEventListener('click', (e) => this.onClick(e));
		}
	  
		onClick(e) {
		  // Stop default behaviour from the browser
		  e.preventDefault();
		  // Add an overflow on the <details> to avoid content overflowing
		  this.el.style.overflow = 'hidden';
		  // Check if the element is being closed or is already closed
		  if (this.isClosing || !this.el.open) {
			this.open();
		  // Check if the element is being openned or is already open
		  } else if (this.isExpanding || this.el.open) {
			this.shrink();
		  }
		}
	  
		shrink() {
		  // Set the element as "being closed"
		  this.isClosing = true;
		  
		  // Store the current height of the element
		  const startHeight = `${this.el.offsetHeight}px`;
		  // Calculate the height of the summary
		  const endHeight = `${this.summary.offsetHeight}px`;
		  
		  // If there is already an animation running
		  if (this.animation) {
			// Cancel the current animation
			this.animation.cancel();
		  }
		  
		  // Start a WAAPI animation
		  this.animation = this.el.animate({
			// Set the keyframes from the startHeight to endHeight
			height: [startHeight, endHeight]
		  }, {
			duration: 400,
			easing: 'ease-out'
		  });
		  
		  // When the animation is complete, call onAnimationFinish()
		  this.animation.onfinish = () => this.onAnimationFinish(false);
		  // If the animation is cancelled, isClosing variable is set to false
		  this.animation.oncancel = () => this.isClosing = false;
		}
	  
		open() {
		  // Apply a fixed height on the element
		  this.el.style.height = `${this.el.offsetHeight}px`;
		  // Force the [open] attribute on the details element
		  this.el.open = true;
		  // Wait for the next frame to call the expand function
		  window.requestAnimationFrame(() => this.expand());
		}
	  
		expand() {
		  // Set the element as "being expanding"
		  this.isExpanding = true;
		  // Get the current fixed height of the element
		  const startHeight = `${this.el.offsetHeight}px`;
		  // Calculate the open height of the element (summary height + content height)
		  const endHeight = `${this.summary.offsetHeight + this.content.offsetHeight}px`;
		  
		  // If there is already an animation running
		  if (this.animation) {
			// Cancel the current animation
			this.animation.cancel();
		  }
		  
		  // Start a WAAPI animation
		  this.animation = this.el.animate({
			// Set the keyframes from the startHeight to endHeight
			height: [startHeight, endHeight]
		  }, {
			duration: 400,
			easing: 'ease-out'
		  });
		  // When the animation is complete, call onAnimationFinish()
		  this.animation.onfinish = () => this.onAnimationFinish(true);
		  // If the animation is cancelled, isExpanding variable is set to false
		  this.animation.oncancel = () => this.isExpanding = false;
		}
	  
		onAnimationFinish(open) {
		  // Set the open attribute based on the parameter
		  this.el.open = open;
		  // Clear the stored animation
		  this.animation = null;
		  // Reset isClosing & isExpanding
		  this.isClosing = false;
		  this.isExpanding = false;
		  // Remove the overflow hidden and the fixed height
		  this.el.style.height = this.el.style.overflow = '';
		}
	  }
	  
	  document.querySelectorAll('details').forEach((el) => {
		new Accordion(el);
	  });
/* Upcoming work js ends*/
	  
(function($) {

	var	$window = $(window),
		$body = $('body'),
		$wrapper = $('#wrapper'),
		$header = $('#header'),
		$footer = $('#footer'),
		$main = $('#main'),
		$main_articles = $main.children('article');

	// Breakpoints.
		breakpoints({
			xlarge:   [ '1281px',  '1680px' ],
			large:    [ '981px',   '1280px' ],
			medium:   [ '737px',   '980px'  ],
			small:    [ '481px',   '736px'  ],
			xsmall:   [ '361px',   '480px'  ],
			xxsmall:  [ null,      '360px'  ]
		});

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

	// Fix: Flexbox min-height bug on IE.
		if (browser.name == 'ie') {

			var flexboxFixTimeoutId;

			$window.on('resize.flexbox-fix', function() {

				clearTimeout(flexboxFixTimeoutId);

				flexboxFixTimeoutId = setTimeout(function() {

					if ($wrapper.prop('scrollHeight') > $window.height())
						$wrapper.css('height', 'auto');
					else
						$wrapper.css('height', '100vh');

				}, 250);

			}).triggerHandler('resize.flexbox-fix');

		}

	// Nav.
		var $nav = $header.children('nav'),
			$nav_li = $nav.find('li');

		// Add "middle" alignment classes if we're dealing with an even number of items.
			if ($nav_li.length % 2 == 0) {

				$nav.addClass('use-middle');
				$nav_li.eq( ($nav_li.length / 2) ).addClass('is-middle');

			}

	// Main.
		var	delay = 325,
			locked = false;

		// Methods.
			$main._show = function(id, initial) {

				var $article = $main_articles.filter('#' + id);

				// No such article? Bail.
					if ($article.length == 0)
						return;

				// Handle lock.

					// Already locked? Speed through "show" steps w/o delays.
						if (locked || (typeof initial != 'undefined' && initial === true)) {

							// Mark as switching.
								$body.addClass('is-switching');

							// Mark as visible.
								$body.addClass('is-article-visible');

							// Deactivate all articles (just in case one's already active).
								$main_articles.removeClass('active');

							// Hide header, footer.
								$header.hide();
								$footer.hide();

							// Show main, article.
								$main.show();
								$article.show();

							// Activate article.
								$article.addClass('active');

							// Unlock.
								locked = false;

							// Unmark as switching.
								setTimeout(function() {
									$body.removeClass('is-switching');
								}, (initial ? 1000 : 0));

							return;

						}

					// Lock.
						locked = true;

				// Article already visible? Just swap articles.
					if ($body.hasClass('is-article-visible')) {

						// Deactivate current article.
							var $currentArticle = $main_articles.filter('.active');

							$currentArticle.removeClass('active');

						// Show article.
							setTimeout(function() {

								// Hide current article.
									$currentArticle.hide();

								// Show article.
									$article.show();

								// Activate article.
									setTimeout(function() {

										$article.addClass('active');

										// Window stuff.
											$window
												.scrollTop(0)
												.triggerHandler('resize.flexbox-fix');

										// Unlock.
											setTimeout(function() {
												locked = false;
											}, delay);

									}, 25);

							}, delay);

					}

				// Otherwise, handle as normal.
					else {

						// Mark as visible.
							$body
								.addClass('is-article-visible');

						// Show article.
							setTimeout(function() {

								// Hide header, footer.
									$header.hide();
									$footer.hide();

								// Show main, article.
									$main.show();
									$article.show();

								// Activate article.
									setTimeout(function() {

										$article.addClass('active');

										// Window stuff.
											$window
												.scrollTop(0)
												.triggerHandler('resize.flexbox-fix');

										// Unlock.
											setTimeout(function() {
												locked = false;
											}, delay);

									}, 25);

							}, delay);

					}

			};

			$main._hide = function(addState) {

				var $article = $main_articles.filter('.active');

				// Article not visible? Bail.
					if (!$body.hasClass('is-article-visible'))
						return;

				// Add state?
					if (typeof addState != 'undefined'
					&&	addState === true)
						history.pushState(null, null, '#');

				// Handle lock.

					// Already locked? Speed through "hide" steps w/o delays.
						if (locked) {

							// Mark as switching.
								$body.addClass('is-switching');

							// Deactivate article.
								$article.removeClass('active');

							// Hide article, main.
								$article.hide();
								$main.hide();

							// Show footer, header.
								$footer.show();
								$header.show();

							// Unmark as visible.
								$body.removeClass('is-article-visible');

							// Unlock.
								locked = false;

							// Unmark as switching.
								$body.removeClass('is-switching');

							// Window stuff.
								$window
									.scrollTop(0)
									.triggerHandler('resize.flexbox-fix');

							return;

						}

					// Lock.
						locked = true;

				// Deactivate article.
					$article.removeClass('active');

				// Hide article.
					setTimeout(function() {

						// Hide article, main.
							$article.hide();
							$main.hide();

						// Show footer, header.
							$footer.show();
							$header.show();

						// Unmark as visible.
							setTimeout(function() {

								$body.removeClass('is-article-visible');

								// Window stuff.
									$window
										.scrollTop(0)
										.triggerHandler('resize.flexbox-fix');

								// Unlock.
									setTimeout(function() {
										locked = false;
									}, delay);

							}, 25);

					}, delay);


			};

		// Articles.
			$main_articles.each(function() {

				var $this = $(this);

				// Close.
					$('<div class="close">Close</div>')
						.appendTo($this)
						.on('click', function() {
							location.hash = '';
						});

				// Prevent clicks from inside article from bubbling.
					$this.on('click', function(event) {
						event.stopPropagation();
					});

			});

		// Events.
			$body.on('click', function(event) {

				// Article visible? Hide.
					if ($body.hasClass('is-article-visible'))
						$main._hide(true);

			});

			$window.on('keyup', function(event) {

				switch (event.keyCode) {

					case 27:

						// Article visible? Hide.
							if ($body.hasClass('is-article-visible'))
								$main._hide(true);

						break;

					default:
						break;

				}

			});

			$window.on('hashchange', function(event) {

				// Empty hash?
					if (location.hash == ''
					||	location.hash == '#') {

						// Prevent default.
							event.preventDefault();
							event.stopPropagation();

						// Hide.
							$main._hide();

					}

				// Otherwise, check for a matching article.
					else if ($main_articles.filter(location.hash).length > 0) {

						// Prevent default.
							event.preventDefault();
							event.stopPropagation();

						// Show article.
							$main._show(location.hash.substr(1));

					}

			});

		// Scroll restoration.
		// This prevents the page from scrolling back to the top on a hashchange.
			if ('scrollRestoration' in history)
				history.scrollRestoration = 'manual';
			else {

				var	oldScrollPos = 0,
					scrollPos = 0,
					$htmlbody = $('html,body');

				$window
					.on('scroll', function() {

						oldScrollPos = scrollPos;
						scrollPos = $htmlbody.scrollTop();

					})
					.on('hashchange', function() {
						$window.scrollTop(oldScrollPos);
					});

			}

		// Initialize.

			// Hide main, articles.
				$main.hide();
				$main_articles.hide();

			// Initial article.
				if (location.hash != ''
				&&	location.hash != '#')
					$window.on('load', function() {
						$main._show(location.hash.substr(1), true);
					});

})(jQuery);