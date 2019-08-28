let state = 0;

function updateState(state, action) {
    if (action.type === 'INCREMENT') {
        return state + action.amount;
    } else if (action.type === 'DECREMENT') {
        return state - action.amount;
    } else {
        return state;
    }
}

// реализация Observer pattern заключается в возможности объекту этого класса
// получат оповещение об изменении состояние других объектов
// и тем самым наблюдать за ними
class Store {
    constructor(updateState, state) {
        this._updateState = updateState;
        this._state = state;

        // все части приложение, которым важно знать о обновление state, передадут callbacks
        // в свою очередь store при изменение state вызовит callbacks
        this._callbacks = [];
    }

    get state() {
        return this._state;
    }

    update(action) {
        this._state = this._updateState(this._state, action);
        this._callbacks.forEach(callback => callback())
    }

    subscribe(callback) {
        this._callbacks.push(callback);

        // фактическая реализация unsubscribe
        // возращаем новый массив _callbacks без callback, который был вызван текущим вызовом subscribe
        // например без () => console.log('State changed', store.state)
        return () => this._callbacks = this._callbacks.filter(cb => cb !== callback)
    }
}

const store = new Store(updateState, 0);

const incrementAction = { type: 'INCREMENT', amount: 5 };
const decrementAction = { type: 'DECREMENT', amount: 3 };

const unsubscribe = store.subscribe(() => console.log('State changed 1', store.state));
store.subscribe(() => console.log('State changed 2', store.state));

store.update(incrementAction);
unsubscribe();
store.update(decrementAction);
store.update(0);