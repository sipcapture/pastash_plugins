# PaStash Command Filter
This is an experimental filter executing a pipeline of commands against an array of objects, emitting results.


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
    plugins => ['@pastash/command_chain']
    cmd => ".filter('eyes', 'brown').chain().groupBy('sex')"
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
