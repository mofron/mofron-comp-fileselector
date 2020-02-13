# mofron-comp-fileselector
[mofron](https://mofron.github.io/mofron/) is module based frontend framework.

file select button component for mofron


# Install
```
npm install mofron mofron-comp-fileselector
```

# Sample
```html
<require>
    <tag load="mofron-comp-fileselector">FileSel</tag>
</require>

<script run=init>
let chg_evt = (p1,p2,p3) => { console.log(p1.value()); }
</script>

<FileSel change-event=@chg_evt size=(2rem,0.3rem)>
    <multiple>true</multiple>
    <text>file select</text>
</FileSel>
```

# Parameter

| Short<br>Form | Parameter Name | Type | Description |
|:-------------:|:---------------|:-----|:------------|
| | button | mofron-comp-button | button component |
| | | | undefined: call as getter |
| | filetxt | mixed | string: file name text |
| | | | mofron-comp-text: file name text component |
| | | | undefined: call as getter |
| ◯  | text | string | button text |
| | | | undefined: call as getter |
| | multiple | boolean | true: multiple selector |
| | | | false: single selector |
| | | | undefined: call as getter |
| | accept | string | accept file types |
| | | | undefined: call as getter |
| | base64Value | string | base64 value |
| | value | string | value string |
| | height | string(size) | button height |
| | | | undefined: call as getter |
| | | key-value | style option |
| | width | string(size) | button width |
| | | | undefined: call as getter |
| | | key-value | style option |

