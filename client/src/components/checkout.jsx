import React, { useEffect, useState } from 'react'
import { Button, Text, Actions, ActionsGroup, ActionsLabel, List, ListItem, Icon, Box, Avatar, Input, useStore, Link, Checkbox, zmp, Preloader } from 'zmp-framework/react'
import shop from '../static/icons/shop.svg'
import deliveryIcon from '../static/icons/delivery.svg'
import clockIcon from '../static/icons/clock.svg'
import noteIcon from '../static/icons/note.svg'
import { Price } from './prices'
import ProductOrder from './product-order'
import DeliveryMethodPicker from './delivery-method-picker'
import store from '../store'
import ShippingTimePicker from './shipping-time-picker'
import '../css/checkout.scss'

const Checkout = ({ children, onReturn }) => {
  const showCheckout = useStore('showCheckout')
  const setShowCheckout = (value) => {
    store.dispatch('setShowCheckout', value)
  }
  const selectedShop = useStore('selectedShop')
  const selectedAddress = useStore('selectedAddress')
  const cart = useStore('cart')
  const totalAmount = useStore('totalAmount')
  const shipping = useStore('shipping')

  const [show, setShow] = useState(false)
  useEffect(() => setShow(showCheckout), [showCheckout])

  const selectedDiscount = useStore('selectedDiscount')
  const showDiscounts = () => {
    zmp.views.main.router.navigate('/discount')
    setShowCheckout(false)
  }

  const [loading, setLoading] = useState(false)
  const checkout = async () => {
    setLoading(true)
    await store.dispatch('checkout')
    setLoading(false)
  }

  const shippingTime = useStore('shippingTime')
  const note = useStore('note')

  const changeShippingTime = () => {
    document.querySelector('#shipping-time-picker').click()
  }

  const [aggree, setAggree] = useState(true)

  return (
    <>
      <div onClick={() => setShowCheckout(true)}>{children}</div>
      <Actions
        className="custom-action-sheet"
        opened={show}
        onActionsClosed={() => setShowCheckout(false)}
        onActionsClose={() => {
          if (onReturn) {
            onReturn()
          }
        }}
      >
        <ActionsGroup>
          <Button typeName="ghost" className="close-button" onClick={() => setShowCheckout(false)}>
            <Icon zmp="zi-arrow-left" size={24}></Icon>
          </Button>
          <ActionsLabel bold>
            <span className="title">X??c nh???n ????n h??ng</span>
          </ActionsLabel>
        </ActionsGroup>
        <ActionsGroup>
          <ActionsLabel className="p-0">
            <Box className="text-left">
              <Text bold>Ph????ng th???c nh???n h??ng</Text>
            </Box>
            <DeliveryMethodPicker onOpen={() => setShowCheckout(false)} onReturn={() => setShowCheckout(true)}>
              <List className="my-0">
                <ListItem>
                  {shipping ? <Avatar slot="media" src={deliveryIcon} size="24" /> : <Avatar slot="media" src={shop} size="24" />}
                  <Icon slot="content" zmp="zi-chevron-right" />
                  {shipping ? <Box className="text-left">
                    <Text bold fontSize="16">Giao t???n n??i</Text>
                    {selectedAddress ? <>
                      <Text bold className="mb-0">{selectedAddress.name} - {selectedAddress.phone}</Text>
                      <Text>{selectedAddress.address}</Text>
                    </> : <Text className="text-secondary">T??i x??? giao ?????n ?????a ch??? c???a b???n</Text>}
                  </Box> : <Box className="text-left">
                    <Text bold fontSize="16">{selectedShop.name}</Text>
                    <Text className="text-secondary">{selectedShop.address}</Text>
                  </Box>}
                </ListItem>
              </List>
            </DeliveryMethodPicker>
          </ActionsLabel>
          <ActionsLabel className="p-0">
            <Box className="text-left"><Text bold>Th??ng tin kh??ch h??ng</Text></Box>
            <List className="my-0">
              <ListItem className="shipping-time">
                <Box slot="root-start" className="label">Th???i gian nh???n h??ng</Box>
                <Avatar slot="media" src={clockIcon} size="24" />
                <Icon slot="content" zmp="zi-chevron-right" />
                <ShippingTimePicker value={shippingTime} onChange={value => store.dispatch('setShippingTime', value)} placeholder="Th???i gian nh???n h??ng" title="Th???i gian nh???n h??ng" className="flex-1" />
              </ListItem>
              <ListItem className="editable-info">
                <Box slot="root-start" className="label">Ghi ch??</Box>
                <img slot="media" src={noteIcon} size="24" />
                <div className="inline-input"><Input type="textarea" maxlength={500} placeholder="Nh???p n???i dung ghi ch??... (t???i ??a 500 k?? t???)" resizable value={note} onChange={e => store.dispatch('setNote', e.target.value)} /></div>
              </ListItem>
            </List>
          </ActionsLabel>
          <ActionsLabel className="p-0">
            <Box className="text-left"><Text bold>Th??ng tin ????n h??ng</Text></Box>
            <List className="my-0">
              {cart.map((item, i) => <ListItem key={i}>
                <img slot="media" src={item.product.image} className="product-image" />
                <Price slot="content" amount={item.subtotal} unit="??" className="pr-4" />
                <Box className="text-left">
                  <Text className="mb-0" bold>
                    <span className="text-danger">{item.quantity}x</span> {item.product.name}
                  </Text>
                  <div className="d-flex">
                    {item.size && <Text className="mb-0 text-secondary">
                      Size {item.size.name}
                      {item.topping && ', '}
                    </Text>}
                    {item.topping && <Text className="mb-0 text-secondary">
                      {item.topping.name}
                    </Text>}
                  </div>
                  {item.note && <Text className="mb-0 text-secondary">
                    Ghi ch??: {item.note}
                  </Text>}
                  <ProductOrder product={item.product} cartItem={item} cartIndex={i}>
                    <Link className="text-primary">Ch???nh s???a</Link>
                  </ProductOrder>
                </Box>
              </ListItem>)}
              <ListItem>
                <Text slot="media" className="text-secondary">T???m t??nh</Text>
                <Price slot="content" amount={totalAmount} unit="??" className="pr-4" />
              </ListItem>
            </List>
          </ActionsLabel>
        </ActionsGroup>
        <ActionsGroup />
        <ActionsLabel className="sticky-action-footer">
          <List className="my-0">
            <ListItem>
              <Text slot="before-title" className="text-secondary mb-0">M?? ??u ????i</Text>
              <Icon slot="content" zmp="zi-chevron-right" />
              <Link onClick={showDiscounts} slot="after" >{selectedDiscount ? <Text slot="after" bold className="mb-0">{selectedDiscount}</Text> : <Text className="text-secondary mb-0">Ch???n m?? ??u ????i</Text>}</Link>
            </ListItem>
            <ListItem>
              <div className="flex-1">
                <Box className="d-flex v-center">
                  <Checkbox
                    checked={aggree}
                    onChange={e => setAggree(e.target.checked)}
                    label={<Text className="text-left mb-0" fontSize={12}>
                      T??i ?????ng ?? nh???n m??n t??? <b>{shippingTime[1]}h{`${shippingTime[2]}`.padStart(2, 0)} - {Number(shippingTime[1]) + 1}h{`${shippingTime[2]}`.padStart(2, 0)}</b>. <a onClick={changeShippingTime} className="text-primary d-inline">Ch???n gi??? kh??c.</a>
                    </Text>}
                  />

                </Box>
                <Box className="d-flex v-center space-between">
                  <Text>T???ng ti???n</Text>
                  <Price fontSize={20} bold amount={totalAmount} />
                </Box>
                <Box>
                  <Button onClick={checkout} large responsive fill disabled={loading || !aggree}>
                    {loading && <Preloader className="loading-button" />}
                    Thanh to??n b???ng ZaloPay</Button>
                </Box>
              </div>
            </ListItem>
          </List>
        </ActionsLabel>
      </Actions>
    </>
  )
}

Checkout.displayName = 'zmp-checkout'

export default Checkout
