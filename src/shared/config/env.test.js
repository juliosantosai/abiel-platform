const env = require("./env");


describe("Environment Config",()=>{


    test("debe cargar variables del entorno",()=>{


        expect(env.APP_NAME)
            .toBe("abiel-core");


        expect(env.PORT)
            .toBeGreaterThan(0);


        expect(env.DATABASE_URL)
            .toBeDefined();


    });


});