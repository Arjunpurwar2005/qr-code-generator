import math

def haversine_distance_meters(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """
    Calculates the distance between two GPS coordinates on Earth in meters using the Haversine formula.

    WHY HAVERSINE FORMULA?
    ----------------------
    Flat Euclidean distance (x2-x1)^2 is inaccurate for GPS coordinates because Earth is a sphere.
    The Haversine formula converts latitude/longitude angles to radians and calculates the exact
    surface distance in meters.
    """
    EARTH_RADIUS_METERS = 6371000.0  # Radius of Earth in meters

    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lon2 - lon1)

    a = math.sin(delta_phi / 2.0)**2 + \
        math.cos(phi1) * math.cos(phi2) * math.sin(delta_lambda / 2.0)**2

    c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))

    distance_meters = EARTH_RADIUS_METERS * c
    return distance_meters


def is_within_geofence(
    student_lat: float,
    student_long: float,
    center_lat: float,
    center_long: float,
    radius_meters: float
) -> tuple[bool, float]:
    """
    Checks if student's GPS location is inside the teacher's classroom geofence boundary.

    Returns:
        (is_inside: bool, calculated_distance_in_meters: float)
    """
    distance = haversine_distance_meters(student_lat, student_long, center_lat, center_long)
    is_inside = distance <= radius_meters
    return is_inside, round(distance, 2)
