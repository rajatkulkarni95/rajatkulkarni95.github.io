from __future__ import print_function
from ortools.constraint_solver import routing_enums_pb2
from ortools.constraint_solver import pywrapcp
from sklearn.neighbors import DistanceMetric
from math import radians
import pandas as pd
import numpy as np
from bingmaps.apiservices import LocationByAddress
import time

API_KEY = 'AkfOIX91dHKtVlhn8lNuxzN50wFIe6FjT_763t91zAkpYZwCJsrwEId1G-WGPYYU'

number_of_locations = int(input('Enter Number of Locations'))


def list_of_locations(count):
    """Location Names, Start Points and End Points"""
    locations = []
    for x in range(count):
        location = input('Enter Location: ')
        locations.append(location)

    start_point_text = input('Enter Starting Point: ')
    end_point_text = input('Enter End Point: ')

    start_point = locations.index(start_point_text)
    end_point = locations.index(end_point_text)

    return (locations, start_point, end_point)


def call_api(locations, key):
    """Bing API to retreive Lat and Long for Locations"""
    latitude_list = []
    longitude_list = []
    for locality in locations:
        data = {'locality': locality,
                'key': key}
        location_address = LocationByAddress(data)
        time.sleep(2)

        coordinate_list = location_address.get_coordinates[0]

        latitude_list.append(coordinate_list.latitude)
        longitude_list.append(coordinate_list.longitude)

    return (latitude_list, longitude_list)


def calculate_distance_matrix(locations, latitudes, longitudes):
    """Calculates Distance Matrix for Data Model"""
    locations_df = pd.DataFrame({'city': locations,
                                 'lat': latitudes,
                                 'lon': longitudes,
                                 })

    locations_df['lat'] = np.radians(locations_df['lat'])
    locations_df['lon'] = np.radians(locations_df['lon'])

    dist = DistanceMetric.get_metric('haversine')
    locations_df[['lat', 'lon']].to_numpy()

    result = dist.pairwise(locations_df[['lat', 'lon']].to_numpy())*6373
    distance_matrix = result.tolist()

    return distance_matrix


def create_data_model(distance_matrix, start, end):
    """Stores the data for the problem."""
    data = {}
    data['distance_matrix'] = distance_matrix
    data['num_vehicles'] = 1
    data['starts'] = [start]
    data['ends'] = [end]
    #data['depot'] = 0
    return data


def print_solution(manager, routing, solution, locations):
    """Prints solution on console."""
    index = routing.Start(0)
    plan_output = 'Optimal Vehicle Route :\n'
    route_distance = 0
    while not routing.IsEnd(index):
        place = locations[manager.IndexToNode(index)]
        plan_output += ' {} ->'.format(place)
        previous_index = index
        index = solution.Value(routing.NextVar(index))
        route_distance += routing.GetArcCostForVehicle(
            previous_index, index, 0)
    place = locations[manager.IndexToNode(index)]
    plan_output += ' {}\n'.format(place)
    print(plan_output)
    plan_output += 'Route distance: {} Kilometers\n'.format(route_distance)
    print('Distance Travelled: {} Kilometers'.format(solution.ObjectiveValue()))


def main():
    """Solve the TSP."""
    locations, start_point, end_point = list_of_locations(number_of_locations)
    latitude_list, longitude_list = call_api(locations, API_KEY)
    distance_matrix = calculate_distance_matrix(
        locations, latitude_list, longitude_list)
    data = create_data_model(distance_matrix, start_point, end_point)

    manager = pywrapcp.RoutingIndexManager(len(data['distance_matrix']),
                                           data['num_vehicles'], data['starts'], data['ends'])
    routing = pywrapcp.RoutingModel(manager)

    def distance_callback(from_index, to_index):
        """Returns the distance between the two nodes."""
        # Convert from routing variable Index to distance matrix NodeIndex.
        from_node = manager.IndexToNode(from_index)
        to_node = manager.IndexToNode(to_index)
        return data['distance_matrix'][from_node][to_node]

    transit_callback_index = routing.RegisterTransitCallback(distance_callback)
    routing.SetArcCostEvaluatorOfAllVehicles(transit_callback_index)
    search_parameters = pywrapcp.DefaultRoutingSearchParameters()
    search_parameters.first_solution_strategy = (
        routing_enums_pb2.FirstSolutionStrategy.PATH_CHEAPEST_ARC)
    solution = routing.SolveWithParameters(search_parameters)
    if solution:
        print_solution(manager, routing, solution, locations)


if __name__ == '__main__':
    main()
