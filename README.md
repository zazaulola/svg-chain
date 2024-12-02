<!-- @format -->

# svg-chain

SVG mini-lib with chaining like jQuery

There are two functions in export list of this module:

- `_()` - for create SVG element;
- `$()` - for find element by selector.

You can use it for

    _('path')
      .d("m 100,100 h 400 v 300 h -400 z")
      .strokeWidth('2')
      .stroke('#444')
      .fill('transparent')
      .className('frame')
      .addEventListener('mouseover',(e)=>e.target.classList.add('hover'))
      .addEventListener('mouseoout',(e)=>e.target.classList.remove('hover'))
      .onclick('alert("click")')
      .appendTo('svg')

The code of the module turned out to be small enough to be understandable and easily-complete.
But this code requires a great number of tests to be written before it can be used in production.
