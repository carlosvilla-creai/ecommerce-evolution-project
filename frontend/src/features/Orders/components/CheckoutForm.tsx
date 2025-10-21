/**
 * CheckoutForm Component
 * 
 * Checkout form with shipping and billing address validation
 */
import React from 'react';
import { Form, Input, Checkbox, Button, Card } from 'antd';
import { CreditCardOutlined } from '@ant-design/icons';
import type { CheckoutFormData } from '../types';

const { TextArea } = Input;

interface CheckoutFormProps {
  onSubmit: (formData: CheckoutFormData) => void;
  loading?: boolean;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ onSubmit, loading = false }) => {
  const [form] = Form.useForm();
  const [sameAsShipping, setSameAsShipping] = React.useState(true);

  const handleFinish = (values: any) => {
    const formData: CheckoutFormData = {
      shipping_address: values.shipping_address,
      billing_address: values.same_as_shipping 
        ? values.shipping_address 
        : values.billing_address,
      same_as_shipping: values.same_as_shipping,
      notes: values.notes
    };
    onSubmit(formData);
  };

  const handleSameAsShippingChange = (e: any) => {
    setSameAsShipping(e.target.checked);
    if (e.target.checked) {
      const shippingAddress = form.getFieldValue('shipping_address');
      form.setFieldsValue({ billing_address: shippingAddress });
    }
  };

  return (
    <Card title={<><CreditCardOutlined /> Checkout Information</>}>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{
          same_as_shipping: true
        }}
        requiredMark="optional"
      >
        {/* Shipping Address */}
        <Form.Item
          label="Shipping Address"
          name="shipping_address"
          rules={[
            { required: true, message: 'Please enter your shipping address' },
            { min: 10, message: 'Address must be at least 10 characters' }
          ]}
        >
          <TextArea 
            rows={3} 
            placeholder="Enter your full shipping address (street, city, state, zip code)" 
          />
        </Form.Item>

        {/* Same as Shipping Checkbox */}
        <Form.Item name="same_as_shipping" valuePropName="checked">
          <Checkbox onChange={handleSameAsShippingChange}>
            Billing address is the same as shipping address
          </Checkbox>
        </Form.Item>

        {/* Billing Address (conditional) */}
        {!sameAsShipping && (
          <Form.Item
            label="Billing Address"
            name="billing_address"
            rules={[
              { required: !sameAsShipping, message: 'Please enter your billing address' },
              { min: 10, message: 'Address must be at least 10 characters' }
            ]}
          >
            <TextArea 
              rows={3} 
              placeholder="Enter your full billing address (street, city, state, zip code)" 
            />
          </Form.Item>
        )}

        {/* Order Notes (optional) */}
        <Form.Item
          label="Order Notes (Optional)"
          name="notes"
        >
          <TextArea 
            rows={2} 
            placeholder="Any special instructions or notes for your order" 
            maxLength={500}
          />
        </Form.Item>

        {/* Submit Button */}
        <Form.Item>
          <Button 
            type="primary" 
            htmlType="submit" 
            size="large" 
            block
            loading={loading}
            icon={<CreditCardOutlined />}
          >
            Place Order
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default CheckoutForm;

