import {
  Button,
  Form,
  Input,
} from 'antd'

const Demo = () => {
  const [form] = Form.useForm()

  const onFinish = (values: any) => {
    console.log('values ', values);
  }

  return (
    <div>
      <Form form={form} onFinish={onFinish} layout='horizontal'>
        <Form.Item label='test' name='test'>
          <Input />
        </Form.Item>

        <Form.Item label='test2' name='test2' rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <OverrideFormItem name='test3' label='test3' rules={[{ required: true }]}>
          <Input />
        </OverrideFormItem>
      </Form>
      <Button onClick={() => form.submit()}>Submit</Button>
    </div>
  )
}

interface IProps {
  name: string
  label: string
  [key: string]: any;
}

const OverrideFormItem = (props: IProps) => {
  const {
    label,
    rules,
    ...restProps
  } = props

  return (
    <Form.Item label={label} rules={rules} dependencies={['test3']}>
      {(...args) => {
        console.log('debug ', args)
        return (
          <div style={{ display: 'flex' }}>
            <Form.Item {...restProps} noStyle rules={rules}>
              <Input />
            </Form.Item>
            sub label
          </div>
        )
      }}
    </Form.Item>
  )
}

export default Demo
