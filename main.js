'use strict'

const React = require('react')
const ReactDOM = require('react-dom')
const CodeMirror = require('react-codemirror2')

const curlFrontend = require('./lib/frontends/curl')
const pyreqBackend = require('./lib/backends/python-requests')


// This tells Browserify to pull in these syntax highlighters. We cannot do this
// dynamically, so make sure to update this if new frontends or backends are
// added.
require('codemirror/mode/shell/shell')
require('codemirror/mode/python/python')


const initialInput = `curl 'http://seethroughny.net/tools/required/reports/payroll?action=get' \\
-XPOST \\
-H 'Content-Type: application/x-www-form-urlencoded; charset=UTF-8' \\
-H 'Origin: http://seethroughny.net' \\
-H 'Host: seethroughny.net' \\
-H 'Accept: application/json, text/javascript, */*; q=0.01' \\
-H 'Connection: keep-alive' \\
-H 'Accept-Language: en-us' \\
-H 'Accept-Encoding: gzip, deflate' \\
-H 'Cookie: CONCRETE5=291419e390a3b67a3946e0854cc9e33e' \\
-H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_5) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/11.1.1 Safari/605.1.15' \\
-H 'Referer: http://seethroughny.net/payrolls' \\
-H 'Content-Length: 137' \\
-H 'X-Requested-With: XMLHttpRequest' \\
--data 'PayYear%5B%5D=2017&SortBy=YTDPay+DESC&current_page=0&result_id=0&url=%2Ftools%2Frequired%2Freports%2Fpayroll%3Faction%3Dget&nav_request=0'`



class App extends React.Component {
  constructor() {
    super()
    this.state = {
      input: initialInput,
      frontend: curlFrontend,
      backend: pyreqBackend
    }
  }
  
  process() {
    try {
      var req = this.state.frontend.parse(this.state.input)
      return this.state.backend.generate(req)
    } catch (err) {
      // TODO: Present the error message to the user somehow
      console.log(err)
      return ''
    }
  }
  
  render() {
    return (
      <div>
        <h2>Input</h2>
        <div>
          <CodeMirror.Controlled
            value={this.state.input}
            options={{
              mode: this.state.frontend.highlighter,
              theme: 'material',
              lineNumbers: true
            }}
            onBeforeChange={(editor, data, value) => {
              this.setState({ input: value })
            }}
          />
        </div>
          
        <h2>Output</h2>
        <div>
          <CodeMirror.Controlled
            value={this.process()}
            options={{
              mode: this.state.backend.highlighter,
              theme: 'material',
              lineNumbers: true,
              readOnly: true
            }}
          />
        </div>
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('root'))
