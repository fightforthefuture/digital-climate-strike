# Digital Climate Strike

This September, millions of us will walk out of our workplaces and homes to join young climate strikers on the streets and demand an end to the age of fossil fuels.

This is the source code for the Digital Climate Strike's widget, that will allow anyone with a website to join the digital climate strike in solidarity. [Click here to learn more.](https://globalclimatestrike.net)

This project was inspired by the [Fight for the Future Red Alert widget](https://github.com/fightforthefuture/redalert-widget).

## How to install the widget on your site

Add this one line of JavaScript to any page, and you're good to go: ([**See the demo!**](https://www.fightforthefuture.org?redalert))

```html
<script src="https://digitalclimatestrike.net/widget.js" async></script>
```

You can change the user experience and do some customization via the `DIGITAL_CLIMATE_STRIKE_OPTIONS` [described below](#customization-options).

If you have any problems or questions regarding the widget, please [submit an issue](https://github.com/global-climate-strikes/digital-climate-strike/issues).

## How it works

When you add [**widget.js**](https://github.com/global-climate-strikes/digital-climate-strike/blob/master/static/widget.js) to your site it will show a footer banner informing visitors that your site is supporting the Global Climate Strike and directs them to also join the strike: 

TO ADD: Screen shot of footer banner. 

Then at midnight on September 20th for 24 hours, the banner will expand to be full screen, showing an unavoidable message that your site is joining the Global #ClimateStrike for the day, directing them to join the Global Climate Strike movement:   

TO ADD: Screen shot of full page banner. 

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
     * Always show the widget. Useful for testing. Defaults to false.
     */
    alwaysShowWidget: false, // @type {boolean}

    /**
     * Automatically makes the widget full page Defaults to false.
     */
    forceFullPageWidget: false // @type {boolean}
  };
</script>
<script src="https://digitalclimatestrike.net/widget.js" async></script>
```


