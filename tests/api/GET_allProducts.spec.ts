import {test, expect, request} from '@playwright/test'

const baseUrl = process.env.API_BASE_URL;
 

test.describe("Products API", () => {
    

    test('should get all the product list & validate response', async ({request}) => {
    
    const response = (await request.get(`${baseUrl}/api/productsList`));

    expect(response.status()).toBe(200);

    const responseBody = await response.json();

    expect(responseBody.responseCode).toBe(200);
    expect(responseBody.products).toBeDefined();// this one checks the "products" exists AS A KEY ! in response
    expect(Array.isArray(responseBody.products)).toBe(true)//checks if the products is an array
    expect(responseBody.products.length).toBeGreaterThan(0);//check if the array is not empty
    expect(responseBody.products[0].name).toEqual("Blue Top")//checks 1st item's name value in products list

    })

    test.only('should search product with request param and get totalPrice', async ({request}) => {

    const data =  {
    'search_product': 'top'
     }

    const response = await request.post(`${baseUrl}/api/searchProduct`, {
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