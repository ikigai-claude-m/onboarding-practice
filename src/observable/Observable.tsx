import { create, StateCreator, StoreApi, UseBoundStore } from "zustand";

interface IData<T> {
  value: T;
}

class IObservable<T> {
  private value: UseBoundStore<StoreApi<IData<T>>> | null = null;

  public constructor(initializer: StateCreator<IData<T>, [], []>) {
    this.value = create<IData<T>>(initializer);
  }

  public get() {
    return this.value?.getState().value;
  }

  public set(value: T) {
    if (this.value) {
      if (this.value.getState().value != value) {
        this.value.setState({ value: value });
      }
    }
  }

  public subscribe(listener: (state: T) => void) {
    if (this.value && listener) listener(this.value.getState().value);
    return this.listen(listener);
  }

  public listen(listener: (state: T) => void) {
    if (!this.value || !listener) return null;
    return this.value?.subscribe((state) => listener(state.value));
  }
}

export function Observable<T>(initializer: T) {
  return new IObservable<T>(() => ({
    value: initializer,
  }));
}

export type Subscribe = (() => void) | null;
export type Subscribes = Subscribe[] | null;
