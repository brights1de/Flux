let state = 0;

// функция, которое обновляет состояние должна быть pure function
// такая функция не меняет состояние, а возращает новое
function updateState(state, action) {
    if (action.type === 'INCREMENT') {
        // из-за того что примитивные типы передаются копированием значение, а объекты копированием ссылки
        // нужно создать новый объект
        return { count: state.count + action.amount};
    } else if (action.type === 'DECREMENT') {
        return { count: state.count - action.amount};
    } else {
        return state;
    }
}

class Store {
    constructor(updateState, state) {
        this._updateState = updateState;
        this._state = state;

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

        return () => this._callbacks = this._callbacks.filter(cb => cb !== callback)
    }
}

const initialState = { count: state };

const store = new Store(updateState, initialState);

const incrementAction = { type: 'INCREMENT', amount: 5 };
const decrementAction = { type: 'DECREMENT', amount: 3 };

const unsubscribe = store.subscribe(() => console.log('State changed 1', store.state));
store.subscribe(() => console.log('State changed 2', store.state));

store.update(incrementAction);
unsubscribe();
store.update(decrementAction);
store.update(0);
