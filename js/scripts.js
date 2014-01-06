var HCF = HCF || {}; // namespace

// declare app class
var App = function(){
	
	// public vars
	this.$w					= $(window); // cache window reference
	this.winH				= 0; // window height, assigned in this.setPanelHeights()
	this.thankYouModalClosed = false;
	this.signUpDelay 		= 400;
	this.signUpSpeed		= 500;
	this.panel1arrowDelay 	= 1200;
	this.otherArrowDelays	= 800;
	this.tabletPortraitMaxW = 768;
	this.phoneMaxW			= 568;
	this.minPanelHeight		= 356;
	this.whitePanelTextOffsetY = 30;
	
	this.initVisuals = function(){		
	
		this.setPanelHeights();
		
		// hide all the 'down' arrows
		$(".arrowdown").each(function(){
			$(this).css({'opacity':0, 'bottom': '30px'});
		});
		
		// fade-in email signup box
		$("#signup").delay(HCF.App.signUpDelay).fadeIn(HCF.App.signUpSpeed);
		
		// show first panel's 'down' arrow after the signup
		var windowBottom = 0;
		if(this.$w.width() <= HCF.App.phoneMaxW) {
			// move guardian + gates press items into their own UL below the rest
			var ul = '<ul id="widepress"></ul>';
			$('.press').append(ul);
			var $wide = $('ul#widepress');
			$('#guardian').appendTo($wide);
			$('#gates').appendTo($wide);
		}
	
		$(".panel1 .arrowdown").delay(HCF.App.panel1arrowDelay).animate({
			"bottom": windowBottom, 
			"opacity": "1.0",
			"visibility": "visible" 
		}, "slow");


		
	}; // end this.initVisuals()
	
	this.setPanelHeights = function(){ // adjust layout based on panel height
		
		if(window.innerHeight > 0)
		{
			this.winH = window.innerHeight;
		} else {
			this.winH = Math.ceil(this.$w.height());
		}
		if(this.winH <= this.minPanelHeight){
			this.winH = this.minPanelHeight;
		}
		
		if(this.$w.width() / window.devicePixelRatio > this.phoneMaxW) { // if bigger than phone landscape, adjust some visuals
			
			// set each panel's height to window height
			
				$('.panel1').css('height', HCF.App.winH);
    $('.panel2').css('min-height', HCF.App.winH);
				$('.panel2a, .panel3a').css('height',this.winH/2);
				$('.panel3').css('min-height', HCF.App.winH);
    $('.panel4').css('min-height',this.winH);
			
		
		} else { // phone size
		    
			this.winH = this.winH + 60;
		    if(this.$w.width() <= 320) {
		    	// portrait phone
				$('.panel1').css('height',this.winH);
				$('.panel2').css('min-height',this.winH);				

				if(Math.ceil(this.$w.height()) <= 372){
					this.winH = 510;
				}
				$('.panel3').css('min-height',this.winH);
				$('.panel4').css('min-height',this.winH);
			} else {
				// landscape phone
				$('.panel1').css('height',this.winH - 60);
				$('.panel2').css('min-height',this.winH  - 60);
				$('.panel2a, .panel3a').css('height',this.winH/2);
				$('.panel3').css('min-height',this.winH - 60);
				$('.panel4').css('min-height',this.winH - 60);
			}
		}
		
	    return false;  
	}; // end setPanelHeights();
	
	this.initJumpMenu = function(){
		// interaction for right-side menu
		$('.wrapper_menu').each(function(index, item) {
			var btn = $(item);
			var icon = btn.find('.indicator');
			var text = btn.find('.text');
			text.css('opacity',0);
			text.css('visibility', 'hidden');
			text.css('display','none');
			btn.css('cursor', 'pointer');
			btn.click(function() {
				var target = $(this).attr("name");
				$('html, body').animate({
						scrollTop: Math.ceil($(".panel" + (index + 1)).offset().top)
				 }, 1000, "easeOutQuad");
				return false;
			});
			btn.mouseover(function() {
					text.css('display','block');
					TweenMax.to(text, .5, { css:{autoAlpha:.8}, ease:Cubic.easeInOut });
					return false;
			});
			btn.mouseout(function() {
					text.css('display','none');
					TweenMax.to(text, .5, { css:{autoAlpha:0}, ease:Cubic.easeInOut });
					return false;
			});
				
		});
	}; // end initJumpMenu()
	
    this.updateJumpMenu = function(blockIndex){
	    $('#menu .indicator').each(function(index, item) {
			var $i = $(item);
			$i.removeClass('active');
		});
		$($('#menu .indicator')[blockIndex]).addClass('active');
    }

	this.initDownArrows = function() {
		
		$('.arrowdown').each(function(index, item) {
			var arrow = $(item);
			arrow.click(function() {
				var top = 0;
				var time = 1500;
				if(index < 3){
					top = parseInt($(".panel" + (index + 2)).offset().top);
				} else {
					top = Math.ceil($(".footer").offset().top);
				}
				// account for iOS safari's bottom-bar
				if(index == 0 && (HCF.App.$w.width() <= HCF.App.phoneMaxW)) {
					top += 60;
				}
				
				$('html, body').animate({
				    scrollTop: top
				 }, time, "easeOutQuad");
				 return false;
			});
		});
	};
	
	this.initInteraction = function(){		
		
		if (navigator && navigator.platform && navigator.platform.match(/^(iPad|iPod|iPhone)$/)) {
			// it's an i-device, don't use the overlay on contact form
		} 
		
		this.initJumpMenu();
		this.initDownArrows();
		
		$('#header #logo a').click(function() {			
			$('html, body').animate({
					scrollTop: 0
			 }, 1000, "easeOutQuad");
		});
		
	}
	
	// determines whether browser is iOS Safari or not
	this.isMobileSafari = function() {
		
		// Assign a variable for the application being used
	    var nVer = navigator.appVersion;
	    // Assign a variable for the device being used
	    var nAgt = navigator.userAgent;
	    var verOffset;
	      
	     // First check to see if the platform is an iPhone or iPod
	    if(navigator.platform == 'iPhone' || navigator.platform == 'iPod'){
	        // In Safari, the true version is after "Safari" 
	        if ((verOffset=nAgt.indexOf('Safari'))!=-1) {
	          // Set a variable to use later
	          var mobileSafari = 'Safari';
	        }
	    }
	    
	    // If is mobile Safari
	    if (mobileSafari == 'Safari') { 
	        return true;
	    } 
	    return false;
	} // end isMobileSafari()
	
	// Get window height on mobile Safari
	this.getIOSWindowHeight = function() {
	    // Note, that such zoom detection might not work correctly in other browsers
	    // We use width, instead of height, because there are no vertical toolbars :)
	    var zoomLevel = document.documentElement.clientWidth / window.innerWidth;
	
	    // window.innerHeight returns height of the visible area. 
	    // We multiply it by zoom and get out real height.
	    return window.innerHeight * zoomLevel;
    } // end getIOSWindowHeight()
    
    this.initScrollorama = function(){
       	// destroy scrollorama if it's been initiated
		if(HCF.App.scrollorama){
			HCF.App.scrollorama.destroy();
		}
		// init scrollorama
		HCF.App.scrollorama = $.scrollorama({
	        blocks:		'.panel',
	        enablePin:	false
	    });
    }
    
    this.autoScrollToClosestPanel = function(){
	    // get vertical difference between panels and current scroll
		var diffs = [];
		$('.panel').each(function(){
			var thisDiff = Math.abs($(document).scrollTop() - $(this).offset().top);
			diffs.push(thisDiff);
		});
		
		// pick the lowest number out of the bunch (shortest distance)
		var lowest = Math.min.apply(Math, diffs);
		
		// use that number to determine which one to scroll to
		$('.panel').each(function(){
			var t = parseInt($(this).offset().top);
			var thisDiff = Math.abs($(document).scrollTop() - t);
			if(lowest == thisDiff){
				$('html, body').animate({
				    scrollTop: t
				 }, 500, "easeOutQuad");
			}
		});
    }
    
    this.getClosestPanel = function(){
	    // get vertical difference between panels and current scroll
		var diffs = [];
		$('.panel').each(function(){
			var thisDiff = Math.abs($(document).scrollTop() - $(this).offset().top);
			diffs.push(thisDiff);
		});
		
		// pick the lowest number out of the bunch (shortest distance)
		var lowest = Math.min.apply(Math, diffs);
		var nearestClassName = "";
		
		// use that number to determine which one to scroll to
		$('.panel').each(function(){
			var t = parseInt($(this).offset().top);
			var thisDiff = Math.abs($(document).scrollTop() - t);
			if(lowest == thisDiff){
				nearestClassName = $(this).attr('class').split(" ")[1];
			}
		});
		
		return nearestClassName;
    }
}; // end App()

// when scrolling, set a 'done scrolling' timer and 
// if they stop near panel 2, auto-scroll to it.
$(window).scroll(function() {
	// if this is tablet or desktop:
	if (navigator && navigator.platform && navigator.platform.match(/^(iPad|iPod|iPhone)$/)) {
		// its an i-device, do nothing
	} else {
	    // hilite the final jumpmenu box when document is scrolled down
	    if($(window).scrollTop() + $(window).height() > $(document).height() - 50) {
	    	var navItemCount = $('#menu .indicator').length - 1;
	        HCF.App.updateJumpMenu(navItemCount);
	    }
    }
});

$(document).ready(function(){
	
	HCF.App = new App(); 		// instantiate App in HCF namespace
	HCF.App.initVisuals();		// initialize visuals
	HCF.App.initInteraction();	// initialize interactivity
	
	$("#mc-embedded-subscribe-form").validate({
		rules: {
			'mce-EMAIL': {
				required: true,
				email: true
			}
		},
		messages: {
			'mce-EMAIL': "Please enter a valid email address."
		},
		errorPlacement: function(error, element) {
		    error.appendTo( element.parent().next() );
		}
	});
	
	// listen for orientation changes
	$(window).bind('orientationchange', function() {
	  doOnOrientationChange();
	});
     
    $(window).trigger( "debouncedresize" );	// fire resize handler for consistency
    
    // on IOS, hide the menu bar on load
    window.top.scrollTo(0, 1);
});

function doOnOrientationChange() {
	HCF.App.setPanelHeights();
}
  
// as the window is resizing
$(window).on("throttledresize", function( event ) {
    HCF.App.setPanelHeights();
});

// when window is done resizing
$(window).on("debouncedresize", function( event ) {

	// if this is tablet or desktop:
	if(HCF.App.$w.width() > HCF.App.phoneMaxW) {
	    
		HCF.App.initScrollorama(); // re-init Scrollorama on resize to assign new vars
		
	    // update side-nav menu
		HCF.App.updateJumpMenu(HCF.App.scrollorama.blockIndex);
	    HCF.App.autoScrollToClosestPanel();
	
		HCF.App.scrollorama.onBlockChange(function() {
			console.log('blockchange')
			// update side-nav menu
			HCF.App.updateJumpMenu(HCF.App.scrollorama.blockIndex);
				
		    if(HCF.App.scrollorama.blockIndex == 0){
		    
		    }
		    if(HCF.App.scrollorama.blockIndex == 1){
			    
   				$(".panel2 .arrowdown").delay(HCF.App.otherArrowDelays).animate({
   					"bottom": 0, 
   					"opacity": 1,
   					"visibility": "visible" 
   				}, "slow");
   				
	
		    } // end if(HCF.App.scrollorama.blockIndex == 1)
		    
		    // pin the timed leaves if scrolling down
		    if(HCF.App.scrollorama.blockIndex > 1){
				    }
		    
		    if(HCF.App.scrollorama.blockIndex == 2){
			    
				$(".panel3 .arrowdown").delay(HCF.App.otherArrowDelays).animate({
					"bottom": 0, 
					"opacity": 1,
					"visibility": "visible" 
				}, "slow");
		    } // end if(HCF.App.scrollorama.blockIndex == 2)
		    
		    if(HCF.App.scrollorama.blockIndex == 3){
			    
				$(".panel4 .arrowdown").delay(HCF.App.otherArrowDelays).animate({
					"bottom": 0, 
					"opacity": 1,
					"visibility": "visible" 
				}, "slow");
		    } // end if(HCF.App.scrollorama.blockIndex == 3)
		}); // end HCF.App.scrollorama.onBlockChange()
		
	    HCF.App.scrollorama.animate('.panel3 .left',{ 
		    property:'right', 
		    duration: HCF.App.$w.height() * 0.75, 
	    	delay: 0, 
		    start: '100%',
		    end: '63%'
	    });
		    
	    HCF.App.scrollorama.animate('.panel3 .right',{ 
		    property:'left', 
		    duration: HCF.App.$w.height() * 0.75, 
	    	delay: 0, 
		    start: '100%',
		    end: '63%'
	    });
		    
		if(HCF.App.$w.width() > HCF.App.tabletPortraitMaxW) // if bigger than portrait tablet
		{
		    HCF.App.scrollorama.animate('.panel3 .logo',{ 
			    property:'opacity', 
			    duration: HCF.App.$w.height() * 0.75,
			    delay: HCF.App.$w.height() * 0.25, 
			    start: 0,
			    end: 1.0
		    });
			
		} else { // tablet and smaller
			
		    HCF.App.scrollorama.animate('.panel3 .logo',{ 
			    property:'opacity', 
			    duration: HCF.App.$w.height() * 0.75,
			    delay: 0, 
			    start: 0,
			    end: 1
		    });
		}
	    
	    HCF.App.scrollorama.animate('.extraleaves',{ 
		    property:'top', 
		    duration: Math.round(HCF.App.$w.height() * 2), 
	    	delay: 0, 
		    start: -200
	    });
	    
	    HCF.App.scrollorama.animate('.extraleaves2',{ 
		    property:'top', 
		    duration: Math.round(HCF.App.$w.height() * 1.5), 
	    	delay: 0, 
		    start: -550,
		    end: -100
	    });
    
    } 
    
    if(getParameterByName("thank") && HCF.App.thankYouModalClosed == false)
    {
			if (navigator && navigator.platform && navigator.platform.match(/^(iPad|iPod|iPhone)$/)) {
				// its an i-device, redirect to thankyou page
				console.log("i-device");
			} else {
				// show thankyou in modal
				console.log("pop modal?");
				$('.thankyou').fancybox({
					width : 368,
					minHeight: 428,
					height: 428,
					padding : 0,
					closeBtn : false,
					afterClose: function() { 
						HCF.App.thankYouModalClosed = true; 
						console.log("closed.");
			    }
			  });
			  $(".thankyou").eq(0).trigger('click');
			}
    }
}); // end $(window).on("debouncedresize")

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}
