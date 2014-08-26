ocss-parser [![build][1]][2]
===========

syntax parser for the [OCSS preprocessor][3]

Example Input
-------------

```
display: block
color: red

child
  color: blue
  background: transparant

  subchild
    font-size: 12px

=big
  font-size: 200%

  child
    color: red

^highlight
  border: 1px solid red

  child
    padding: 2em

    subchild
      color: yellow
```

Example Output
--------------

```json
{
  "type":"object",
  "name":"test",
  "indentation":-1,
  "declarations":[
    {
      "raw":"display: block",
      "position":{
        "line":1
      },
      "indentation":0,
      "type":"declaration",
      "property":"display",
      "value":"block"
    },
    {
      "raw":"color: red",
      "position":{
        "line":2
      },
      "indentation":0,
      "type":"declaration",
      "property":"color",
      "value":"red"
    }
  ],
  "elements":[
    {
      "raw":"child",
      "position":{
        "line":4
      },
      "indentation":0,
      "type":"element",
      "name":"child",
      "declarations":[
        {
          "raw":"\tcolor: blue",
          "position":{
            "line":5
          },
          "indentation":1,
          "type":"declaration",
          "property":"color",
          "value":"blue"
        },
        {
          "raw":"\tbackground: transparant",
          "position":{
            "line":6
          },
          "indentation":1,
          "type":"declaration",
          "property":"background",
          "value":"transparant"
        }
      ],
      "elements":[
        {
          "raw":"\tsubchild",
          "position":{
            "line":8
          },
          "indentation":1,
          "type":"element",
          "name":"subchild",
          "declarations":[
            {
              "raw":"\t\tfont-size: 12px",
              "position":{
                "line":9
              },
              "indentation":2,
              "type":"declaration",
              "property":"font-size",
              "value":"12px"
            }
          ]
        }
      ]
    }
  ],
  "modifiers":[
    {
      "raw":"=big",
      "position":{
        "line":11
      },
      "indentation":0,
      "type":"modifier",
      "name":"big",
      "declarations":[
        {
          "raw":"\tfont-size: 200%",
          "position":{
            "line":12
          },
          "indentation":1,
          "type":"declaration",
          "property":"font-size",
          "value":"200%"
        }
      ],
      "elements":[
        {
          "raw":"\tchild",
          "position":{
            "line":14
          },
          "indentation":1,
          "type":"element",
          "name":"child",
          "declarations":[
            {
              "raw":"\t\tcolor: red",
              "position":{
                "line":15
              },
              "indentation":2,
              "type":"declaration",
              "property":"color",
              "value":"red"
            }
          ]
        }
      ]
    }
  ],
  "parentmodifiers":[
    {
      "raw":"^highlight",
      "position":{
        "line":17
      },
      "indentation":0,
      "type":"parentmodifier",
      "name":"highlight",
      "declarations":[
        {
          "raw":"\tborder: 1px solid red",
          "position":{
            "line":18
          },
          "indentation":1,
          "type":"declaration",
          "property":"border",
          "value":"1px solid red"
        }
      ],
      "elements":[
        {
          "raw":"\tchild",
          "position":{
            "line":20
          },
          "indentation":1,
          "type":"element",
          "name":"child",
          "declarations":[
            {
              "raw":"\t\tpadding: 2em",
              "position":{
                "line":21
              },
              "indentation":2,
              "type":"declaration",
              "property":"padding",
              "value":"2em"
            }
          ],
          "elements":[
            {
              "raw":"\t\tsubchild",
              "position":{
                "line":23
              },
              "indentation":2,
              "type":"element",
              "name":"subchild",
              "declarations":[
                {
                  "raw":"\t\t\tcolor: yellow",
                  "position":{
                    "line":24
                  },
                  "indentation":3,
                  "type":"declaration",
                  "property":"color",
                  "value":"yellow"
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}
```

[1]: http://img.shields.io/travis/maxhoffmann/ocss-parser.svg?style=flat
[2]: https://travis-ci.org/maxhoffmann/ocss-parser
[3]: https://github.com/maxhoffmann/ocss
