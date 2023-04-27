import { type FormRule } from 'antd'
export type FormRules = Record<string, FormRule[]>
export enum HttpStatus{
  ERROR,
  SUCCESS,
}
