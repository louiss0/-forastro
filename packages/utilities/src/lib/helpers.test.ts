import { describe, expect, it, test } from "vitest";
import { iterate, iterateRange,range,  } from "./helpers";
import {  IterationInfo } from "./types";



async function generateArrayFromGenerator<T extends AsyncGenerator>(generator:AsyncGenerator) {
        

        const array:Array<Awaited<ReturnType<T["next"]>>["value"]> = []


        for await (const iterator of generator) {
            

            array.push(iterator)


        }

        return array

    }



describe("Iterate  works", () => {
    

    
    test('When array is passed in the value is the first param index is second and iterable is the iteration info ',  async () => { 
        
        for await (const [value, key, info] of iterate(["james", "mary", "john"], (...args) => args)) {
            
            
            expect(value).toBeTypeOf("string")
            expect(key).toBeTypeOf("number")
            expect(info).toBeInstanceOf(IterationInfo)
            
            
            
        }
        

     })
     
    test('When set is passed in the value is the first param key is second and set is third ',  async () => { 
        
        for await (const [value, key, info] of iterate(new Set(["Mack", "Cain", "Ashton"]), (value, key, info) => [value, key,info ])) {
            expect(value).toBeTypeOf("string")
            expect(key).toBeTypeOf("string")
            expect(info).toBeInstanceOf(IterationInfo)
            
        }
         
    })
    
    test('When map is passed in the value is the first param key is second and map is third ',  async () => { 
        
        for await (const [value, key, info] of iterate(new Map([[1, "mary"]]), (value, key, info) => [value, key, info])) {
            
            expect(value).toBeTypeOf("string")
            expect(key).toBeTypeOf("number")
            expect(info).toBeInstanceOf(IterationInfo)
            
        }

         
    })
    
    
    test("IterationInfo's iteration number is plus one  the current index in an array ", async () => {
        

        for await (const [key, info] of iterate([2,3,5], (_, key, info)=> [key, info] as const)) {
            
            expect(key).toBeTypeOf("number")

            expect(key).not.toBe(info.iteration)

            expect(key + 1).toBe(info.iteration)

        
        }


    

    })

    test("Array can be created nicely", async () => {
        

        const res = await generateArrayFromGenerator(iterate(["a", "b", "c"], (...args) => args))

        expect(res).toMatchInlineSnapshot(`
          [
            [
              "a",
              0,
              IterationInfo {
                "firstIterationNum": 0,
                "iterationNum": 0,
                "lastIterationNum": 3,
              },
            ],
            [
              "b",
              1,
              IterationInfo {
                "firstIterationNum": 0,
                "iterationNum": 1,
                "lastIterationNum": 3,
              },
            ],
            [
              "c",
              2,
              IterationInfo {
                "firstIterationNum": 0,
                "iterationNum": 2,
                "lastIterationNum": 3,
              },
            ],
          ]
        `)


    })

    
    

})


describe("Range works", () => {
    

    test("Numbers are counted from start to the stop number by one", () => {
   
      
    
      expect(Array.from(range(1, 5, 1)))
        .toStrictEqual([1,2,3,4])

        

    })

    test("Numbers are counted from start to the stop number depending on step number", () => {
        


      expect(Array.from(range(1,5,1))).toHaveLength(4)

      
    })

    test("Numbers are counted down from start to the stop number by one when start is greater than stop and step is negative", () => {
    

      expect(Array.from(range(6, 1, -1)))
        .toStrictEqual([6, 5, 4, 3, 2])
      
      expect(Array.from(range(6, 1, -1))).toHaveLength(5)
      

      

      
        

    })

    test("Numbers are counted up from start to the stop when step is positive", () => {
        

       
      expect(Array.from(range(1,3,1))).toStrictEqual([1,2])
      

    })
  
  
  it("throws when  startIsGreaterThanStopAndStepIsPositive", () => {
    
    expect((()=> {
      
      for (const _ of range(8, 1, 2)) {}

    }))
      .toThrowErrorMatchingInlineSnapshot('"If you want start to be greater than stop please make step negative"')


  })
  
  
  it("throws when stopIsGreaterThanStartAndStepIsNegative", () => {
    

    expect(() => {
      
      for (const _ of range(1,9,-2)) {}
      

    }).toThrowErrorMatchingInlineSnapshot('"If you want start to be less than stop please make step positive"')

  })


  it("throws when start is equal to stop", () => {
    

    expect(() => {
      
      for (const _ of range(1,1,1)) {}
      

    }).toThrowErrorMatchingInlineSnapshot('"Start can\'t be the same as stop"')

  })

  it("throws when step is equal to zero", () => {
    

    expect(() => {
      
      for (const _ of range(6,4,0)) {}

    }).toThrowErrorMatchingInlineSnapshot('"Step can\'t be zero pick a negative or positive number"')

  })



 })



describe("Iterate Range works", () => {

    test("Iterate Range has both the range number and an iteration number", async () => {


        for await (const [value, info] of iterateRange((value, info)=>[value, info] as const, {start:1, stop:5,})) {
            
            expect(value).toBeTypeOf("number")

            expect(info).toBeInstanceOf(IterationInfo)

        }
        

    })


   
    test("The iteration is plus one of the value", async () => {
        

        for await (const [value, info] of iterateRange((value, info)=>[value, info] as const, {start:1, stop:9})) {
            
            expect(value).toBeTypeOf("number")

            expect(value + 1).toBe(info.iteration)

        }

    })


    


})


describe("Test iteration info", () => {

    
    test("See if the data returned from iteration info is calculated  from Parameters", () => {
  
        
        const res = new IterationInfo(1, 3, 5)
        

        expect(res.count).toBe(4)
        expect(res.isEven).toBe(false)
        expect(res.isFirst).toBe(false)
        expect(res.isLast).toBe(false)
        expect(res.iteration).toBe(4)
        expect(res.remaining).toBe(2)
        expect(res.isOdd).toBe(true)


    })


    const iterationInfo = new IterationInfo(1,3,5)

    test("IterationInfo count to be result of first iteration number subtracted from last iteration number", () => {
     

        expect(iterationInfo).toMatchInlineSnapshot(`
          IterationInfo {
            "firstIterationNum": 1,
            "iterationNum": 3,
            "lastIterationNum": 5,
          }
        `)



    },)

    test("remaining to be calculated from iteration number subtracted from last iteration number", () => {
        
        expect(iterationInfo).toMatchInlineSnapshot(`
          IterationInfo {
            "firstIterationNum": 1,
            "iterationNum": 3,
            "lastIterationNum": 5,
          }
        `)

        expect(iterationInfo.remaining).toBe(2)

    })

    test("IterationInfo isOdd to be true when an odd number is passed in and isEven to be opposite", () => {
      
        expect(iterationInfo).toMatchInlineSnapshot(`
          IterationInfo {
            "firstIterationNum": 1,
            "iterationNum": 3,
            "lastIterationNum": 5,
          }
        `)

        expect(iterationInfo.isOdd).toBe(true)
        expect(iterationInfo.isEven).toBe(false)
    
    
    })

    const iterationInfoTwo = new IterationInfo(2,4,6)

    test("IterationInfo isEven to be true when an odd number is passed in and isOdd to be opposite", () => {
      
        expect(iterationInfoTwo).toMatchInlineSnapshot(`
          IterationInfo {
            "firstIterationNum": 2,
            "iterationNum": 4,
            "lastIterationNum": 6,
          }
        `)

        expect(iterationInfoTwo.isOdd).toBe(false)
        expect(iterationInfoTwo.isEven).toBe(true)
    
    
    })

})

