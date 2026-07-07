import { Client, Account, Databases } from 'appwrite'
import { APPWRITE_ENDPOINT, APPWRITE_PROJECT_ID, backendEnabled } from './config'

let client: Client | null = null
let account: Account | null = null
let databases: Databases | null = null

function init() {
  if (!backendEnabled || client) return
  client = new Client().setEndpoint(APPWRITE_ENDPOINT!).setProject(APPWRITE_PROJECT_ID!)
  account = new Account(client)
  databases = new Databases(client)
}

/** Appwrite Account service, or null in demo mode. */
export function getAccount(): Account | null {
  init()
  return account
}

/** Appwrite Databases service, or null in demo mode. */
export function getDatabases(): Databases | null {
  init()
  return databases
}
