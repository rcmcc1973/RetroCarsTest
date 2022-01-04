import { hooks } from '@bigcommerce/stencil-utils';
import CatalogPage from './catalog';
import compareProducts from './global/compare-products';
import FacetedSearch from './common/faceted-search';
import { createTranslationDictionary } from '../theme/common/utils/translations-utils';

export default class Category extends CatalogPage {
    constructor(context) {
        super(context);
        this.validationDictionary = createTranslationDictionary(context);
    }

    setLiveRegionAttributes($element, roleType, ariaLiveStatus) {
        $element.attr({
            role: roleType,
            'aria-live': ariaLiveStatus,
        });
    }

    makeShopByPriceFilterAccessible() {
        if (!$('[data-shop-by-price]').length) return;

        if ($('.navList-action').hasClass('is-active')) {
            $('a.navList-action.is-active').focus();
        }

        $('a.navList-action').on('click', () => this.setLiveRegionAttributes($('span.price-filter-message'), 'status', 'assertive'));
    }

    onReady() {
        this.arrangeFocusOnSortBy();

        $('[data-button-type="add-cart"]').on('click', (e) => this.setLiveRegionAttributes($(e.currentTarget).next(), 'status', 'polite'));

        this.makeShopByPriceFilterAccessible();

        compareProducts(this.context);

        if ($('#facetedSearch').length > 0) {
            this.initFacetedSearch();
        } else {
            this.onSortBySubmit = this.onSortBySubmit.bind(this);
            hooks.on('sortBy-submitted', this.onSortBySubmit);
        }

        $('a.reset-btn').on('click', () => this.setLiveRegionsAttributes($('span.reset-message'), 'status', 'polite'));

        this.ariaNotifyNoProducts();
    }

    ariaNotifyNoProducts() {
        const $noProductsMessage = $('[data-no-products-notification]');
        if ($noProductsMessage.length) {
            $noProductsMessage.focus();
        }
    }

    initFacetedSearch() {
        const {
            price_min_evaluation: onMinPriceError,
            price_max_evaluation: onMaxPriceError,
            price_min_not_entered: minPriceNotEntered,
            price_max_not_entered: maxPriceNotEntered,
            price_invalid_value: onInvalidPrice,
        } = this.validationDictionary;
        const $productListingContainer = $('#product-listing-container');
        const $facetedSearchContainer = $('#faceted-search-container');
        const productsPerPage = this.context.categoryProductsPerPage;
        const requestOptions = {
            config: {
                category: {
                    shop_by_price: true,
                    products: {
                        limit: productsPerPage,
                    },
                },
            },
            template: {
                productListing: 'category/product-listing',
                sidebar: 'category/sidebar',
            },
            showMore: 'category/show-more',
        };

        this.facetedSearch = new FacetedSearch(requestOptions, (content) => {
            $productListingContainer.html(content.productListing);
            $facetedSearchContainer.html(content.sidebar);

            $('body').triggerHandler('compareReset');

            $('html, body').animate({
                scrollTop: 0,
            }, 100);
        }, {
            validationErrorMessages: {
                onMinPriceError,
                onMaxPriceError,
                minPriceNotEntered,
                maxPriceNotEntered,
                onInvalidPrice,
            },
        });
    }
}

// added functions below, that can be called, and click functions

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

function addCartItem(url, cartId, cartItems) {
     return fetch(url + cartId + '/items', {
         method: "POST",
         credentials: "same-origin",
         headers: {
             "Content-Type": "application/json"},
         body: JSON.stringify(cartItems),
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
