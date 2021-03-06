import { createStore, createState } from 'test/support/Helpers'
import Model from 'app/model/Model'

describe('Hooks – Delete', () => {
  class User extends Model {
    static entity = 'users'

    static fields () {
      return {
        id: this.attr(null),
        name: this.attr('')
      }
    }
  }

  it('can dispatch the `beforeDelete` hook', async () => {
    let hit = false

    const users = {
      actions: {
        beforeDelete (context, record) {
          hit = true
        }
      }
    }

    const store = createStore([{ model: User, module: users }])

    await store.dispatch('entities/users/create', {
      data: { id: 1, name: 'John Doe' }
    })

    await store.dispatch('entities/users/delete', 1)

    expect(hit).toBe(true)
  })

  it('can cancel the delete by returning false from the `beforeDelete` hook', async () => {
    let hit = false

    const users = {
      actions: {
        beforeDelete (context, record) {
          hit = true

          return !(record.name === 'Jane Doe')
        }
      }
    }

    const store = createStore([{ model: User, module: users }])

    await store.dispatch('entities/users/create', {
      data: [
        { id: 1, name: 'John Doe' },
        { id: 2, name: 'Jane Doe' }
      ]
    })

    await store.dispatch('entities/users/delete', 2)

    const expected = createState('entities', {
      users: {
        '1': { $id: 1, id: 1, name: 'John Doe' },
        '2': { $id: 2, id: 2, name: 'Jane Doe' }
      }
    })

    expect(hit).toBe(true)
    expect(store.state.entities).toEqual(expected)
  })

  it('can dispatch the `afterDelete` hook', async () => {
    let hit = false

    const users = {
      actions: {
        afterCreate (context, model) {
          hit = true
        }
      }
    }

    const store = createStore([{ model: User, module: users }])

    await store.dispatch('entities/users/create', {
      data: [
        { id: 1, name: 'John Doe' },
        { id: 2, name: 'Jane Doe' }
      ]
    })

    await store.dispatch('entities/users/delete', 2)

    expect(hit).toBe(true)
  })
})
