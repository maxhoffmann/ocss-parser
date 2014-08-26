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
  "declarations":[
    {
      "position":{
        "line":1
      },
      "type":"declaration",
      "property":"display",
      "value":"block"
    },
    {
      "position":{
        "line":2
      },
      "type":"declaration",
      "property":"color",
      "value":"red"
    }
  ],
  "elements":[
    {
      "position":{
        "line":4
      },
      "type":"element",
      "name":"child",
      "declarations":[
        {
          "position":{
            "line":5
          },
          "type":"declaration",
          "property":"color",
          "value":"blue"
        },
        {
          "position":{
            "line":6
          },
          "type":"declaration",
          "property":"background",
          "value":"transparant"
        }
      ],
      "elements":[
        {
          "position":{
            "line":8
          },
          "type":"element",
          "name":"subchild",
          "declarations":[
            {
              "position":{
                "line":9
              },
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
      "position":{
        "line":11
      },
      "type":"modifier",
      "name":"big",
      "declarations":[
        {
          "position":{
            "line":12
          },
          "type":"declaration",
          "property":"font-size",
          "value":"200%"
        }
      ],
      "elements":[
        {
          "position":{
            "line":14
          },
          "type":"element",
          "name":"child",
          "declarations":[
            {
              "position":{
                "line":15
              },
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
      "position":{
        "line":17
      },
      "type":"parentmodifier",
      "name":"highlight",
      "declarations":[
        {
          "position":{
            "line":18
          },
          "type":"declaration",
          "property":"border",
          "value":"1px solid red"
        }
      ],
      "elements":[
        {
          "position":{
            "line":20
          },
          "type":"element",
          "name":"child",
          "declarations":[
            {
              "position":{
                "line":21
              },
              "type":"declaration",
              "property":"padding",
              "value":"2em"
            }
          ],
          "elements":[
            {
              "position":{
                "line":23
              },
              "type":"element",
              "name":"subchild",
              "declarations":[
                {
                  "position":{
                    "line":24
                  },
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
