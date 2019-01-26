# PaStash Command Filter
This is an experimental filter executing a pipeline of commands against the pass-through array of objects.


### Usage Example
Initialize the command filter and load any plugins. Point to the JSON field containing the data Array.
```
input {
  stdin{}
}

filter {
  json_fields {}
  command {
    debug => true
    field => message
    plugins => [require('@pastash/command_chain')]
    cmd => ".filter('eyes', 'brown').groupBy('sex')"
  }
}

output {
  stdout {}
}

```
#### Pass it an Array
```
[{ "sex": "male", "age": 35, "eyes": "brown" },{ "sex": "female", "age": 38, "eyes": "brown" },{ "sex": "male", "age": 29, "eyes": "brown" }]
```
