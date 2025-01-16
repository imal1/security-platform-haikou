import resourceVverviewIcon from "@assets/img/nav/resource-overview-icon.svg";
import dataResourcesIcon from "@assets/img/nav/data-resources-icon.svg";
import serviceResourcesIcon from "@assets/img/nav/service-resources-icon.svg";
import mapNetworkingIcon from "@assets/img/nav/map-networking-icon.svg";
import mapServicesIcon from "@assets/img/nav/map-services-icon.svg";
import systemConfigurationIcon from "@assets/img/nav/system-configuration-icon.svg";
import userManageIcon from "@assets/img/nav/user-manage-icon.svg";
import operationManageIcon from "@assets/img/nav/operation-manage-icon.svg";

export const getMenuIcon = function (code) {
    let icon;

    switch (code) {
        case "nav_resource-overview":
            icon = (<img className="menu-icon" src = { resourceVverviewIcon } />);
            break;
        case "nav_data_resources":
            icon = (<img className="menu-icon" src = { dataResourcesIcon } />);
            break;
        case "nav_service_resources":
            icon = (<img className="menu-icon" src = { serviceResourcesIcon } />);
            break;
        case "nav_map_networking":
            icon = (<img className="menu-icon" src = { mapNetworkingIcon } />);
            break;
        case "nav_map_services":
            icon = (<img className="menu-icon" src = { mapServicesIcon } />);
            break;
        case "nav_system_configuration":
            icon = (<img className="menu-icon" src = { systemConfigurationIcon } />);
            break;
        case "nav_user_manage":
            icon = (<img className="menu-icon" src = { userManageIcon } />);
            break;
        case "nav_operation_manage":
            icon = (<img className="menu-icon" src = { operationManageIcon } />);
            break;
        default:
            icon = null;
    }

    return icon;
}