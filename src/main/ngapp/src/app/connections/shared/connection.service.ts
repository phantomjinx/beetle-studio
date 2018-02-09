/**
 * @license
 * Copyright 2017 JBoss Inc
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { ConnectionType } from "@connections/shared/connection-type.model";
import { Connection } from "@connections/shared/connection.model";
import { ConnectionsConstants } from "@connections/shared/connections-constants";
import { JdbcTableFilter } from "@connections/shared/jdbc-table-filter.model";
import { NewConnection } from "@connections/shared/new-connection.model";
import { SchemaInfo } from "@connections/shared/schema-info.model";
import { ServiceCatalogSource } from "@connections/shared/service-catalog-source.model";
import { TemplateDefinition } from "@connections/shared/template-definition.model";
import { ApiService } from "@core/api.service";
import { AppSettingsService } from "@core/app-settings.service";
import { LoggerService } from "@core/logger.service";
import { Table } from "@dataservices/shared/table.model";
import { environment } from "@environments/environment";
import { PropertyDefinition } from "@shared/property-form/property-definition.model";
import { Observable } from "rxjs/Observable";

@Injectable()
export class ConnectionService extends ApiService {

  private static readonly nameValidationUrl = environment.komodoWorkspaceUrl
    + ConnectionsConstants.connectionsRootPath
    + "/nameValidation/";

  private http: Http;

  constructor( http: Http, appSettings: AppSettingsService, logger: LoggerService ) {
    super( appSettings, logger  );
    this.http = http;
  }

  /**
   * Validates the specified connection name. If the name contains valid characters and the name is unique, the
   * service returns 'null'. Otherwise, a 'string' containing an error message is returned.
   *
   * @param {string} name the connection name
   * @returns {Observable<String>}
   */
  public isValidName( name: string ): Observable< string > {
    if ( !name || name.length === 0 ) {
      return Observable.of( "Connection name cannot be empty" );
    }

    const url = ConnectionService.nameValidationUrl + encodeURIComponent( name );

    return this.http.get( url, this.getAuthRequestOptions() )
      .map( ( response ) => {
        if ( response.ok ) {
          if ( response.text() ) {
            return response.text();
          }

          return "";
        } } )
      .catch( ( error ) => this.handleError( error ) );
  }

  /**
   * Get the connections from the komodo rest interface
   * @returns {Observable<Connection[]>}
   */
  public getAllConnections(): Observable<Connection[]> {
    return this.http
      .get(environment.komodoWorkspaceUrl + ConnectionsConstants.connectionsRootPath, this.getAuthRequestOptions())
      .map((response) => {
        const connections = response.json();
        return connections.map((connection) => Connection.create( connection ));
      })
      .catch( ( error ) => this.handleError( error ) );
  }

  /**
   * Create a connection via the komodo rest interface
   * @param {NewConnection} connection
   * @returns {Observable<boolean>}
   */
  public createConnection(connection: NewConnection): Observable<boolean> {
    return this.http
      .post(environment.komodoWorkspaceUrl + ConnectionsConstants.connectionsRootPath + "/" + connection.getName(),
             connection, this.getAuthRequestOptions())
      .map((response) => {
        return response.ok;
      })
      .catch( ( error ) => this.handleError( error ) );
  }

  /**
   * Deploy a connection via the komodo rest interface
   * @param {string} connectionName
   * @returns {Observable<boolean>}
   */
  public deployConnection(connectionName: string): Observable<boolean> {
    const connectionPath = this.getKomodoUserWorkspacePath() + "/" + connectionName;
    return this.http
      .post(environment.komodoTeiidUrl + ConnectionsConstants.connectionRootPath,
        { path: connectionPath}, this.getAuthRequestOptions())
      .map((response) => {
        return response.ok;
      })
      .catch( ( error ) => this.handleError( error ) );
  }

  /**
   * Bind a service catalog source via the komodo rest interface
   * @param {string} serviceCatalogSourceName
   * @returns {Observable<boolean>}
   */
  public bindServiceCatalogSource(serviceCatalogSourceName: string): Observable<boolean> {
    return this.http
      .post(environment.komodoTeiidUrl + ConnectionsConstants.serviceCatalogSourcesRootPath,
        { name: serviceCatalogSourceName}, this.getAuthRequestOptions())
      .map((response) => {
        return response.ok;
      })
      .catch( ( error ) => this.handleError( error ) );
  }

  /**
   * Delete a connection via the komodo rest interface
   * @param {string} connectionId
   * @returns {Observable<boolean>}
   */
  public deleteConnection(connectionId: string): Observable<boolean> {
    return this.http
      .delete(environment.komodoWorkspaceUrl + ConnectionsConstants.connectionsRootPath + "/" + connectionId,
               this.getAuthRequestOptions())
      .map((response) => {
        return response.ok;
      })
      .catch( ( error ) => this.handleError( error ) );
  }

  /**
   * Get the connection types from the komodo rest interface
   * @returns {ConnectionType[]}
   */
  public getConnectionTypes(): ConnectionType[] {
    const connectionTypes: ConnectionType[] = [];
    const connType1: ConnectionType = new ConnectionType();
    connType1.setName("postgresql");
    connType1.setDescription("PostgreSQL database");
    const connType2: ConnectionType = new ConnectionType();
    connType2.setName("mysql");
    connType2.setDescription("MySQL database");
    const connType3: ConnectionType = new ConnectionType();
    connType3.setName("mongodb");
    connType3.setDescription("MongoDB database");
    const connType4: ConnectionType = new ConnectionType();
    connType4.setName("mariadb");
    connType4.setDescription("MariaDB database");

    connectionTypes.push(connType1);
    connectionTypes.push(connType2);
    connectionTypes.push(connType3);
    connectionTypes.push(connType4);

    return connectionTypes;
  }

  /**
   * Get the service catalog sources from the komodo rest interface.
   * A connectionType may be optionally be provided - will then return only the sources of that type
   * If a connectionType is not provided, all available sources will be returned.
   * @param {ConnectionType} connectionType the desired connection type (optional)
   * @returns {ConnectionType[]}
   */
  public getServiceCatalogSources(connectionType?: ConnectionType): ServiceCatalogSource[] {
    const catalogSources: ServiceCatalogSource[] = [];
    const source1: ServiceCatalogSource = new ServiceCatalogSource();
    source1.setName("aPGSource");
    source1.setType("postgresql");
    source1.setBound(false);
    const source2: ServiceCatalogSource = new ServiceCatalogSource();
    source2.setName("aMySqlSource");
    source2.setType("mysql");
    source2.setBound(false);
    const source3: ServiceCatalogSource = new ServiceCatalogSource();
    source3.setName("aMongoSource");
    source3.setType("mongodb");
    source3.setBound(false);
    const source4: ServiceCatalogSource = new ServiceCatalogSource();
    source4.setName("bMongoSource");
    source4.setType("mongodb");
    source4.setBound(false);

    if (connectionType) {
      const cType = connectionType.getName();
      if (source1.getType() === cType) {
        catalogSources.push(source1);
      }
      if (source2.getType() === cType) {
        catalogSources.push(source2);
      }
      if (source3.getType() === cType) {
        catalogSources.push(source3);
      }
      if (source4.getType() === cType) {
        catalogSources.push(source4);
      }
    } else {
      catalogSources.push(source1);
      catalogSources.push(source2);
      catalogSources.push(source3);
      catalogSources.push(source4);
    }

    return catalogSources;
  }
  /**
   * Get the available ServiceCatalogSources from the komodo rest interface
   * @returns {Observable<ServiceCatalogSource[]>}
   */
  public getAllServiceCatalogSources(): Observable<ServiceCatalogSource[]> {
    return this.http
      .get(environment.komodoTeiidUrl + ConnectionsConstants.serviceCatalogSourcesRootPath, this.getAuthRequestOptions())
      .map((response) => {
        const catalogSources = response.json();
        return catalogSources.map((catSource) => ServiceCatalogSource.create( catSource ));
      })
      .catch( ( error ) => this.handleError( error ) );
  }

  /**
   * Get the connection templates from the komodo rest interface
   * @returns {Observable<TemplateDefinition[]>}
   */
  public getConnectionTemplates(): Observable<TemplateDefinition[]> {
    return this.http
      .get( environment.komodoTeiidUrl + "/templates", this.getAuthRequestOptions())
      .map((response) => {
        const templates = response.json();
        return templates.map((template) => TemplateDefinition.create( template ));
      })
      .catch( ( error ) => this.handleError( error ) );
  }

  /**
   * Get the connection template property definitions from the komodo rest interface
   * @param {string} templateName
   * @returns {Observable<Array<PropertyDefinition<any>>>}
   */
  public getConnectionTemplateProperties(templateName: string): Observable<Array<PropertyDefinition<any>>> {
    return this.http
      .get( environment.komodoTeiidUrl + "/templates/" + templateName + "/entries", this.getAuthRequestOptions())
      .map((response) => {
        const entries = response.json() as Array<PropertyDefinition<any>>;
        return entries.map((entry) => PropertyDefinition.create( entry ));
      })
      .catch( ( error ) => this.handleError( error ) );
  }

  /**
   * Get the schema infos for a Jdbc Connection
   * @param {string} connectionId
   * @returns {Observable<SchemaInfo[]>}
   */
  public getConnectionSchemaInfos(connectionId: string): Observable<SchemaInfo[]> {
    return this.http
      .get( environment.komodoTeiidUrl + "/connections/" + connectionId + "/JdbcCatalogSchema", this.getAuthRequestOptions())
      .map((response) => {
        const infos = response.json();
        return infos.map((info) => SchemaInfo.create( info ));
      })
      .catch( ( error ) => this.handleError( error ) );
  }

  /**
   * Get the tables for the specified input (connection and filters) for a Jdbc Connection
   * @param {JdbcTableFilter} tableFilter
   * @returns {Observable<string>}
   */
  public getJdbcConnectionTables(tableFilter: JdbcTableFilter): Observable<string[]> {
    return this.http
      .post( environment.komodoTeiidUrl + "/connections/Tables", tableFilter, this.getAuthRequestOptions())
      .map((response) => {
        const info = response.json();
        const tableNames = [];
        let i = 1;
        let tableKey = "Table" + i;
        let tableName = info.Information[tableKey];
        while ( tableName && tableName.length > 0 ) {
          tableNames.push(tableName);
          i++;
          tableKey = "Table" + i;
          tableName = info.Information[tableKey];
        }
        return tableNames;
      })
      .catch( ( error ) => this.handleError( error ) );
  }

  /**
   * Create a connection and deploy it to server via the komodo rest interface
   * @param {NewConnection} connection
   * @returns {Observable<boolean>}
   */
  public createAndDeployConnection(connection: NewConnection): Observable<boolean> {
    // Chain the individual calls together in series to build the DataService
    return this.createConnection(connection)
      .flatMap((res) => this.deployConnection(connection.getName()));
  }

  /**
   * Create a connection in the Komodo repo - also binds the specified serviceCatalogSource
   * @param {NewConnection} connection the connection object
   * @returns {Observable<boolean>}
   */
  public createAndBindConnection(connection: NewConnection): Observable<boolean> {
    return this.http
      .post(environment.komodoWorkspaceUrl + ConnectionsConstants.connectionsRootPath + "/serviceCatalog/" + connection.getName(),
        connection, this.getAuthRequestOptions())
      .map((response) => {
        return response.ok;
      })
      .catch( ( error ) => this.handleError( error ) );
  }

  /**
   * Update a connection in the Komodo repo - also binds the specified serviceCatalogSource.
   * @param {NewConnection} connection the connection object
   * @returns {Observable<boolean>}
   */
  public updateAndBindConnection(connection: NewConnection): Observable<boolean> {
    return this.http
      .put(environment.komodoWorkspaceUrl + ConnectionsConstants.connectionsRootPath + "/serviceCatalog/" + connection.getName(),
        connection, this.getAuthRequestOptions())
      .map((response) => {
        return response.ok;
      })
      .catch( ( error ) => this.handleError( error ) );
  }

}
