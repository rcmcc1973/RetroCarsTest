# RetroCarsTest
Bigcommerce Code Test

## Table of contents
* [Summary](#summary)
* [Test Questions](#test-questions)
* [Notes](#notes)

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

### 1. Product Image Hover

```
.../templates/components/products/card.html
```


```
code goes here
```
