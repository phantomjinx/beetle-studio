/**
 * @license
 * Copyright 2017 JBoss Inc
 *
 * Licensed under the Apache License, /
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { NavigationItemConfig } from "patternfly-ng";

export class ConnectionsConstants {

  public static readonly connectionsRootRoute = "connections";
  public static readonly connectionsRootPath = "/" + ConnectionsConstants.connectionsRootRoute;

  public static readonly connectionRootRoute = "connection";
  public static readonly connectionRootPath = "/" + ConnectionsConstants.connectionRootRoute;

  public static readonly addConnectionRoute = ConnectionsConstants.connectionsRootRoute + "/add-connection";
  public static readonly addConnectionPath = ConnectionsConstants.connectionsRootPath + "/add-connection";

  public static readonly serviceCatalogSourcesRootRoute = "serviceCatalogSources";
  public static readonly serviceCatalogSourcesRootPath = "/" + ConnectionsConstants.serviceCatalogSourcesRootRoute;

  public static driverNamePropertyLabel = "Driver Name";
  public static jndiNamePropertyLabel = "JNDI Name";
  public static serviceCatalogSourceNameLabel = "Service Catalog Source";

  public static readonly connectionsNavItem: NavigationItemConfig = {
    title: "Connections",
    iconStyleClass: "fa fa-fw fa-plug",
    url: ConnectionsConstants.connectionsRootPath
  };

}
