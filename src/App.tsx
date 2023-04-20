import { Button } from 'antd'

function App () {
  console.log(process.env)
  return (
    <div className="w-screen h-screen">
      <Button type="primary">Side Effect</Button>
    </div>
  )
}

export default App
