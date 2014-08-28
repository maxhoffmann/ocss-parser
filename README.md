ocss-parser
===========

[![version][1]][2]
[![build][3]][4]

syntax parser for the [OCSS preprocessor][5]

Example Input
-------------

```
display: block
color: red

child
  color: blue
  background: transparent

  :hover
    color: red

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
  "type": "object",
  "name": "test",
  "declarations": [
    {
      "position": {
        "line": 1
      },
      "type": "declaration",
      "property": "display",
      "value": "block"
    },
    {
      "position": {
        "line": 2
      },
      "type": "declaration",
      "property": "color",
      "value": "red"
    }
  ],
  "elements": [
    {
      "position": {
        "line": 4
      },
      "type": "element",
      "name": "child",
      "declarations": [
        {
          "position": {
            "line": 5
          },
          "type": "declaration",
          "property": "color",
          "value": "blue"
        },
        {
          "position": {
            "line": 6
          },
          "type": "declaration",
          "property": "background",
          "value": "transparent"
        }
      ],
      "pseudoelements": [
        {
          "position": {
            "line": 8
          },
          "type": "pseudoelement",
          "name": "hover",
          "declarations": [
            {
              "position": {
                "line": 9
              },
              "type": "declaration",
              "property": "color",
              "value": "red"
            }
          ]
        }
      ],
      "elements": [
        {
          "position": {
            "line": 11
          },
          "type": "element",
          "name": "subchild",
          "declarations": [
            {
              "position": {
                "line": 12
              },
              "type": "declaration",
              "property": "font-size",
              "value": "12px"
            }
          ]
        }
      ]
    }
  ],
  "modifiers": [
    {
      "position": {
        "line": 14
      },
      "type": "modifier",
      "name": "big",
      "declarations": [
        {
          "position": {
            "line": 15
          },
          "type": "declaration",
          "property": "font-size",
          "value": "200%"
        }
      ],
      "elements": [
        {
          "position": {
            "line": 17
          },
          "type": "element",
          "name": "child",
          "declarations": [
            {
              "position": {
                "line": 18
              },
              "type": "declaration",
              "property": "color",
              "value": "red"
            }
          ]
        }
      ]
    }
  ],
  "parentmodifiers": [
    {
      "position": {
        "line": 20
      },
      "type": "parentmodifier",
      "name": "highlight",
      "declarations": [
        {
          "position": {
            "line": 21
          },
          "type": "declaration",
          "property": "border",
          "value": "1px solid red"
        }
      ],
      "elements": [
        {
          "position": {
            "line": 23
          },
          "type": "element",
          "name": "child",
          "declarations": [
            {
              "position": {
                "line": 24
              },
              "type": "declaration",
              "property": "padding",
              "value": "2em"
            }
          ],
          "elements": [
            {
              "position": {
                "line": 26
              },
              "type": "element",
              "name": "subchild",
              "declarations": [
                {
                  "position": {
                    "line": 27
                  },
                  "type": "declaration",
                  "property": "color",
                  "value": "yellow"
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

Tests
-----

Install dependencies with `npm install` once. Afterwards run `npm test` every time you want to start the tests.

[1]: http://img.shields.io/npm/v/ocss-parser.svg?style=flat
[2]: https://www.npmjs.org/package/ocss-parser
[3]: http://img.shields.io/travis/maxhoffmann/ocss-parser.svg?style=flat
[4]: https://travis-ci.org/maxhoffmann/ocss-parser
[5]: https://github.com/maxhoffmann/ocss
