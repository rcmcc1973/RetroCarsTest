# RetroCarsTest
Bigcommerce Code Test

## Table of contents
* [Summary](#summary)
* [Test Questions](#test-questions)
* [Notes](#notes)
	* [Product Image Hover](#product-image-hover)

## Summary
This project is a Bigcommerce test for a job opportunity. It involves handlebars and storefront API.
	
## Test Questions

### Product & Category Setup:
Create a product called 'Special Item' which will be assigned to a new category called 'Special Items'. Add 2 images to the new 'Special Item' product. The 'Special Item' product should be the only item which shows in this category.

1. Create a feature that will show the product's second image when it is hovered over. 

2. Add a button at the top of the category page labeled 'Add All To Cart'. When clicked, the product will be added to the cart. Notify the user that the product has been added. 

3. If the cart has an item in it - show a button next to the 'Add All To Cart' button which says 'Remove All Items'. When clicked it should clear the cart and notify the user.

Note: Both buttons should utilize the Storefront API for completion.

4. Bonus. If a customer is logged in - at the top of the category page show a banner that shows some customer details (i.e. name, email, phone, etc). This should utilize the data that is rendered via Handlebars on the Customer Object.

	
## Notes

### Product Image Hover

```
.../templates/components/products/card.html
```

Added this code using handlebars and quick inline javascript to show second product image when hovered.

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
### Add Cart Button
```
.../templates/pages/category.html
```
Added this following code to only show if the category is "Special Items".
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


