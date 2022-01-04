# RetroCarsTest
Bigcommerce Code Test

## Table of Contents
* [Summary](#summary)
* [Test Questions](#test-questions)
* [Notes](#notes)
	* [Product Image Hover](#product-image-hover)
	* [Add Item to Cart Button](#add-item-to-cart-button)
	* [Delete Cart Items Button](#delete-cart-items-button)
	* [Bonus Customer Info](#bonus-customer-info)

## Summary
This project is a Bigcommerce test for a job opportunity. It involves handlebars and storefront API.  Thanks for the opportuntiy to practice what I already know in Bigcommerce, as well as the opportunity to learn and research new stuff.  
	
## Test Questions

### Product & Category Setup:
Create a product called 'Special Item' which will be assigned to a new category called **'Special Items'**. Add 2 images to the new **'Special Item'** product. The 'Special Item' product should be the only item which shows in this category.

1. Create a feature that will show the product's **second image** when it is **hovered** over. 

2. Add a button at the top of the category page labeled **'Add All To Cart'**. When clicked, the product will be added to the cart. Notify the user that the product has been added. 

3. If the cart has an item in it - show a button next to the **'Add All To Cart'** button which says **'Remove All Items'**. When clicked it should clear the cart and notify the user.

Note: Both buttons should utilize the Storefront API for completion.

4. **Bonus.** If a customer is logged in - at the top of the category page show a banner that shows some customer details **(name, email, and phone)**. This should utilize the data that is rendered via Handlebars on the Customer Object.

	
## Notes

**Custom.scss** file was used for mobile responsiveness for buttons and customer info test question items.

### Product Image Hover

```
.../templates/components/products/card.html
```

Added this code below using handlebars and quick inline javascript to show second product image when hovered.

```
<img class="card-image lazyload"
onmouseover="this.src='{{getImage images.[1] img size (cdn default)}}'"
onmouseout="this.src='{{getImage image 'productgallery_size' (cdn default)}}'"
data-sizes="auto" src="{{cdn 'img/loading.svg'}}"
data-src="{{getImage image 'productgallery_size' (cdn theme_settings.default_image_product)}}"
alt="{{image.alt}}"
title="{{image.alt}}"
>
```
Commented out Quick View Button, and edited and moved Add to Cart button below image without buttons appearing when hovering over it, for a clean view for the purpose of this test.

```
{{#if add_to_cart_url }}
<a href="{{add_to_cart_url}}" data-event-type="product-click" data-product-id="{{id}}" class="button button--primary _prod_add_to_cart_">{{lang 'products.add_to_cart'}}</a>
{{/if}}
```	
### Add Item to Cart Button
```
.../templates/pages/category.html
```
Added this following code to only show if the category is **"Special Items"**.  This code also shows the **"Remove All Items"** button, and each success notifications.
```
{{#if category.name '===' 'Special Items'}}

    <div class="add_all_to_cart_container">
      <button type="button" class="add_all_button">Add All To Cart</button>
      <button type="button" class="remove_all_button" style="display:none;">Remove All Items</button>
    </div>

    <div class="success_add_all" style="display:none;">
      <p>All products in this category have been added to your cart.</p>
    </div>

    <div class="success_remove_all" style="display:none;">
      <p>All products in your cart have been removed.</p>
    </div>

{{/if}}
```
In the next file, **category.js**, the following code was added.
```
.../assets/js/theme/category.js
```
These script functions added:
```
function createCart(url, cartItems) {
   return fetch(url, {
       method: "POST",
       credentials: "same-origin",
       headers: {
           "Content-Type": "application/json"},
       body: JSON.stringify(cartItems),
   })
   .then(response => response.json());
 };

function getCart(url) {
   return fetch(url, {
       method: "GET",
       credentials: "same-origin"
   })
   .then(response => response.json());
};

function deleteCartItem(url, cartId, itemId) {
   return fetch(url + cartId + '/items/' + itemId, {
       method: "DELETE",
       credentials: "same-origin",
       headers: {
           "Content-Type": "application/json",}
})
.then(response => response.json());
};
```
Then this code added to always show **"Remove All Items"** button if page reloads.
```
$(document).ready(function() {

  getCart('/api/storefront/carts?include=lineItems.digitalItems.options,lineItems.physicalItems.options')
    .then(data => console.log(JSON.stringify(data)))
    .catch(error => console.error(error));

  if ($(".cart-quantity").hasClass("countPill--positive")) {
    $(".remove_all_button").show();
    console.log('cart is not empty, show the remove all button');
  } else {
    console.log('cart is empty, or not refreshed to show');
  }

}); // end doc ready function
```
This following code refers to the function **'createCart'** to create the cart and add the items references in the lineitems when the **"Add All To Cart"** button is clicked.  It also shows the **success notification**, as well as the **"Remove All Items"** button. 
```
$(".add_all_button").click(function() {

  createCart("/api/storefront/carts", {
     "lineItems": [
     {
         "quantity": 1,
         "productId": 112
     }
     ]}
  )
  .then(data => console.log(JSON.stringify(data)))
  .catch(error => console.error(error));

  getCart('/api/storefront/carts?include=lineItems.digitalItems.options,lineItems.physicalItems.options')
    .then(data => console.log(JSON.stringify(data)))
    .catch(error => console.error(error));

  $(".success_add_all").show();
  $(".remove_all_button").show();

});  // click add all Button
```
### Delete Cart Items Button
The buttons and notification html for this are shown above.  The code below was added for the objective to delete all items in the cart.  I ran into a roadblock which I will describe below.
```
$(".remove_all_button").click(function() {

  getCart('/api/storefront/carts?include=lineItems.digitalItems.options,lineItems.physicalItems.options')
    .then(data => console.log(JSON.stringify(data)))
    .catch(error => console.error(error));

  deleteCartItems("/api/storefront/carts?include=lineItems.physicalItems.id") // doesn't work yet
  .then(data => console.log(JSON.stringify(data)))
  .catch(error => console.log(error));

  $(".success_remove_all").show();
  $(".success_add_all").hide();
  $(".remove_all_button").hide();

});  // click remove all button
```
The part above that mentions **"// doesn't work yet"** I am still trying to understand better.  This will be something awesome to learn.

_I'm sure it's an easy thing and when I do learn I might face palm.  **LOL**_

The code below is the base.  The 'url' is '/api/storefront/carts', but I am trying to figure out how to reference the dynamic **'cartId'** and 
**'itemId'** here.
```
function deleteCartItem(url, cartId, itemId) {
   return fetch(url + cartId + '/items/' + itemId, {
       method: "DELETE",
       credentials: "same-origin",
       headers: {
           "Content-Type": "application/json",}
})
.then(response => response.json());
};
```
This code can obtain the cardId, but the var can't be used in the code above.  Also, I can't seem to figure out how to pull in the itemId.  I look forward to learning more about this!!!

### Bonus Customer Info
For this test, adding a bar of customer info at the top of the category page, I did the following to make the header changes only appear on the category page.

* In the layout folder, duplicated **base.html** and named it **category.html***

* In the .../components/common/ folder, duplicated **header.html** and name it **categoryheader.html***

In the new .../layout/category.html file I changed the following code to reference the new categoryheader.html:
```
Original:
{{> components/common/header }}

Changed to:
{{> components/common/categoryheader }}
```
In the file .../templates/pages/category.html I changed the following code to refernce the new layout base called category.html
```
Original:
{{> layout/base}}

Changed to:
{{> layout/category}}
```
In the new .../components/common/categoryheader.html file I added this code:
```
{{#if customer}}

    <div class="cci_wrap" style="display:none;">
      <div class="category_customer_info">

        <div class="cci_item">
        <i class="fas fa-user-circle"></i>
        {{customer.name}}
        </div>

        <div class="cci_item">
        <i class="fas fa-at"></i>
        {{customer.email}}
        </div>

        <div class="cci_item">
        <i class="fas fa-mobile-alt"></i>
        {{customer.phone}}
        </div>

      </div><!-- end .category_custom_info -->
    </div><!-- end cci_wrap -->

    {{/if}}
```
The inline display:none is set to only show min-width of 801px.  For this test, I wasn't going to change the mobile structure of the header.  So doing this just shows it on desktop.  I added fontawesome icons.  I used the @ symbol icon because it isn't a link like mailto:


