import {test, expect, request} from '@playwright/test'
import searchTerms from '../../test-data/searchTerms.json'
 

test.describe("Products API", () => {
    

    test('should get all the product list & validate response', async ({request}) => {
    
    const response = (await request.get(`/api/productsList`));

    expect(response.status()).toBe(200);

    const responseBody = await response.json();

    expect(responseBody.responseCode).toBe(200);
    expect(responseBody.products).toBeDefined();// this one checks the "products" exists AS A KEY ! in response
    expect(Array.isArray(responseBody.products)).toBe(true)//checks if the products is an array
    expect(responseBody.products.length).toBeGreaterThan(0);//check if the array is not empty
    expect(responseBody.products[0].name).toEqual("Blue Top")//checks 1st item's name value in products list

    })

    //data driven test part
    for(const search of searchTerms){
        test(`should search for a product: ${search.term}`, async ({request}) => {
            const response = await request.post('/api/searchProduct', {
                form: {
                    'search_product': search.term
                }
            })//post req end
            expect(response.status()).toBe(200);
            const responseBody = await response.json();

            for (const product of responseBody.products) {

                //the term we are searching resides either in product.name or in product.category.category
                //so we check both of them to see if either one of em contains search_term 
                const category_name = product.category.category.toLowerCase();
                const item_name = product.name.toLowerCase();
 

                const contains_search_term = item_name.includes(search.term) || category_name.includes(search.term)

                expect(contains_search_term,`Expected name or category to contain ${search.term} but gor:   name: ${item_name}  category: ${category_name}`).toBe(true)

             //expect(product.category.category.toLowerCase()).toContain(search.term);
            }

        })//test end 
    } //for of end





    test.only('should search product with request param and get totalPrice', async ({request}) => {

    const data =  {
    'search_product': 'top'
     }

    const response = await request.post(`/api/searchProduct`, {
      form: data,
    });

    const asd = await response.json();

    let totalPrice = 0;

    await asd.products.forEach( (x: { price: any; }) => {
       const eachPrice = +x.price.slice(3)
        totalPrice+= eachPrice;
    })

    console.log(totalPrice);

    })


})