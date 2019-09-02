# Digital Climate Strike

This September, millions of us will walk out of our workplaces and homes to join young climate strikers on the streets and demand an end to the age of fossil fuels.

This is the source code for the Digital Climate Strike's widget, that will allow anyone with a website to join the digital climate strike in solidarity. [Click here to learn more.](https://globalclimatestrike.net)

This project was inspired by the [Fight for the Future Red Alert widget](https://github.com/fightforthefuture/redalert-widget).

## How to install the widget on your site

Add this one line of JavaScript to any page, and you're good to go:

```html
<script src="https://assets.digitalclimatestrike.net/widget.js" async></script>
```

You can change the user experience and do some customization via the `DIGITAL_CLIMATE_STRIKE_OPTIONS` [described below](#customization-options).

If you have any problems or questions regarding the widget, please [submit an issue](https://github.com/global-climate-strikes/digital-climate-strike/issues).

## How it works & Demo

When you add [**widget.js**](https://github.com/global-climate-strikes/digital-climate-strike/blob/master/static/widget.js) to your site it will show a footer banner ([demo](https://assets.digitalclimatestrike.net/demo.html)) informing visitors that your site is supporting the Global Climate Strike and directs them to also join the strike:

![A screenshot of the Digital Climate Strike footer widget](https://digital.globalclimatestrike.net/wp-content/uploads/sites/71/2019/08/DCS_Mockup_Banner2.png)

Then at midnight on September 20th for 24 hours, the banner will expand to be full screen ([demo](https://assets.digitalclimatestrike.net/demo.html?fullPage)), showing an unavoidable message that your site is joining the Global #ClimateStrike for the day, directing them to join the Global Climate Strike movement:

![A screenshot of the Digital Climate Strike full page widget](https://digital.globalclimatestrike.net/wp-content/uploads/sites/71/2019/08/DCS_Mockup_Full2.png) 

For those who cannot shut down their website for the day, a closable overlay option can also be configured ([demo](https://assets.digitalclimatestrike.net/demo.html?fullPage&showCloseButton)):

![A screenshot of the Digital Climate Strike full page widget with close button](https://digital.globalclimatestrike.net/wp-content/uploads/sites/71/2019/08/DCS_Mockup_Partial2.png)

You can demo the widget in different languages by adding a 'language' parameter to the URL. ([Example](https://assets.digitalclimatestrike.net/demo.html?fullPage&language=de)) 

The widget is designed to appear once per user, per device, per day, but can be configured to display at a different interval. If you'd like to force it to show up on your page for testing, reload the page with `#ALWAYS_SHOW_DIGITAL_CLIMATE_STRIKE` at the end of the URL.

Please take a look at [**widget.js**](https://github.com/global-climate-strikes/digital-climate-strike/blob/master/static/widget.js) if you want to see exactly what you're embedding on your page.

The widget is compatible with Firefox, Chrome (desktop and mobile), Safari (desktop and mobile), Microsoft Edge, and Internet Explorer 11.

## Customization options

If you define an object called `DIGITAL_CLIMATE_STRIKE_OPTIONS` before including the widget code, you can pass some properties in to customize the default behavior.

```html
<script type="text/javascript">
  var DIGITAL_CLIMATE_STRIKE_OPTIONS = {
    /**
     * Specify view cookie expiration. After initial view, widget will not be
     * displayed to a user again until after this cookie expires. Defaults to 
     * one day.
     */
    cookieExpirationDays: 1, // @type {number}
    
    /**
     * Set the language of the widget. We currently support:
     * 'en': English
     * 'de': German
     * 'es': Spanish
     * Defaults to null, which will obey the nagivator.language setting of the 
     * viewer's browser.
     */
     language: null, // @type {string}
     
    /**
     * Allow you to override the iFrame hostname. Defaults to https://assets.digitalclimatestrike.net  
     */
    iframeHost: 'https://assets.digitalclimatestrike.net', // @type {string}

    /**
     * Prevents the widget iframe from loading Google Analytics. Defaults to
     * false. (Google Analytics will also be disabled if doNotTrack is set on
     * the user's browser.)
     */
    disableGoogleAnalytics: false, // @type {boolean}

    /**
     * Always show the widget, even when someone has closed the widget and set the cookie on their device. 
     * Useful for testing. Defaults to false.
     */
    alwaysShowWidget: false, // @type {boolean}

    /**
     * Automatically makes the widget full page. Defaults to false.
     */
    forceFullPageWidget: false, // @type {boolean}
    
    /**
    * For the full page widget, shows a close button "x" and hides the message about the site being 
    * available tomorrow. Defaults to false.
    */
    showCloseButtonOnFullPageWidget: false, // @type {boolean}
    
    /**
     * The date when the sticky footer widget should start showing on your web site.
     * Note: the month is one integer less than the number of the month. E.g. 8 is September, not August.
     * Defaults to new Date(2019, 7, 1) (August 1st, 2019).
     */
    footerDisplayStartDate: new Date(), //@ type {Date object}
    
    /**
     * The date when the full page widget should showing on your web site for 24 hours. 
     * Note: the month is one integer less than the number of the month. E.g. 8 is September, not August.
     * Defaults to new Date(2019, 8, 20) (September 20th, 2019)
     */
    fullPageDisplayStartDate: new Date(2019, 8, 20), //@ type {Date object}
  };
</script>
<script src="https://assets.digitalclimatestrike.net/widget.js" async></script>
```


