export function canCreateUser(DbUserRole) {
    if (DbUserRole === "admin") {
        return true;
    } else if (DbUserRole === "dispatcher") {
        return true;
    } else if (DbUserRole === "rider") {
        return false;
    }
}
