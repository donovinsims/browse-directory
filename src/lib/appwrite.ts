import { Client, Account, Databases, Teams } from 'appwrite'
import { APPWRITE_ENDPOINT, APPWRITE_PROJECT_ID, backendEnabled } from './config'

let client: Client | null = null
let account: Account | null = null
let databases: Databases | null = null
let teams: Teams | null = null

function init() {
  if (!backendEnabled || client) return
  client = new Client().setEndpoint(APPWRITE_ENDPOINT!).setProject(APPWRITE_PROJECT_ID!)
  account = new Account(client)
  databases = new Databases(client)
  teams = new Teams(client)
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

/** Appwrite Teams service, or null in demo mode. */
export function getTeams(): Teams | null {
  init()
  return teams
}
