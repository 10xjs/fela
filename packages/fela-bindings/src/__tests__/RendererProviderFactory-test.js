import 'raf/polyfill'
import React, { Component } from 'react'
import { render } from 'react-dom'
import PropTypes from 'prop-types'

import RendererProviderFactory from '../RendererProviderFactory'

import createRenderer from '../../../fela/src/createRenderer'

import createSnapshot from '../__helpers__/createSnapshot'

const RendererProvider = RendererProviderFactory(
  Component,
  children => children,
  {
    childContextTypes: { renderer: PropTypes.object },
  }
)

const mockCallback = jest.fn()

jest.mock('fela-dom', () => ({
  rehydrate: () => mockCallback('rehydrate'),
  render: () => mockCallback('render'),
}))

afterAll(() => {
  jest.unmock('fela-dom')
})

describe('RendererProviderFactory', () => {
  beforeEach(() => {
    mockCallback.mockClear()
  })

  it('should do the initial render before childrens componentDidMount hook', () => {
    class Child extends Component {
      componentDidMount() {
        mockCallback('didMount')
      }
      render() {
        return <div>Hello World</div>
      }
    }

    render(
      <RendererProvider rehydrate renderer={createRenderer()}>
        <Child />
      </RendererProvider>,
      document.createElement('div')
    )

    expect(mockCallback.mock.calls.length).toBe(2)
    expect(mockCallback.mock.calls[0][0]).toBe('render')
    expect(mockCallback.mock.calls[1][0]).toBe('didMount')
  })
})
