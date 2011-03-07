### 8093 is a small steganography JavaScript program that hides data within images.

[demo](http://svrv.net/e/xperiments/8093/8093.html)

---

#### Badly written "how to use"
Drag and drop a PNG-image onto the page and enter the data you want to hide in the large text area.
Click 'hide' to hide data, and 'seek' to search for data.

Due to how the canvas handles transparency, images with much transparency might have problems. In order to prevent data from being messed up in such images, it currently only stores data in pixels with no transparency.

There are three optional ways to prevent unwanted people to read your messages, each with a different level of security.

The easiest and least secure method is the four colored boxed between the text area and the image. These represents the red(R), green(G) and blue(B) values of the pixels in which data is to be stored. Due to the few possible combinations, brute forcing this is quite easy.

The second method is the 'x' and 'y' text fields, which takes integer values. The coordinate (x,y) is the first pixel in the image to start hiding your data. If no values are given, the default values will be used, which are half the width and height of the image, respectively. This gives a lot more combinations, but it is still relatively easy to brute force.

The last and most secure method requires some knowledge of programming. It's written in the 'z' text field and takes a JavaScript function as input (e.g 'function(n){ /* SOME CODE HERE */ }') which returns a position in the image (represented as a 1d array) relative to (x,y) to store the n'th path of your message.

Any working JavaScript code within the function can be used, with the requirements that the function z(n) should return an integer (it will be floored) and not the same integer twice for i from 0 to at least four times the length of your message (depending on the RGB settings). The program will notify you if it thinks your function returns the same value twice or if there won't be enough space in the image to hide your data with the current settings. 

The default value for 'z' is 'function (i){return (i%2)?i:-i;}'.


For easy sharing of these settings, there will appear a string in green text under the text fields in the pattern of [#hidden-with:RGB#X#Y#Z#]. If this string is added to the large text field when clicking 'hide' or 'seek', the settings in the string will be used. 


I hope this was understandable, and thank you for taking the time to look at my little app.
