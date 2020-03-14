from __future__ import print_function
from ortools.constraint_solver import routing_enums_pb2
from ortools.constraint_solver import pywrapcp
from sklearn.neighbors import DistanceMetric
from math import radians
import pandas as pd
import numpy as np


number_of_locations = int(input('Enter Number of Locations'))

def list_of_locations(count):
    locations = []
    for x in range(count):
        location = input('Enter Location: ')
        locations.append(location)

    start_point_text = input('Enter Starting Point: ')
    end_point_text = input('Enter End Point: ')

    start_point = locations.index(start_point_text)
    end_point = locations.index(end_point_text)


    return (locations, start_point, end_point)


def calculate_distance_matrix(locations):
    locations_df = pd.DataFrame({'city':locations,
        'lat':[12.9716,19.076,28.7041,22.5726,13.0827,23.2599],
                            'lon':[77.5946,72.877,77.1025,88.639,80.2707,77.4126],
                            })


    locations_df['lat'] = np.radians(locations_df['lat'])
    locations_df['lon'] = np.radians(locations_df['lon'])

    dist = DistanceMetric.get_metric('haversine')
    locations_df[['lat','lon']].to_numpy()

    result = dist.pairwise(locations_df [['lat','lon']].to_numpy())*6373
    distance_matrix = result.tolist()

    return distance_matrix


#[[0,120,847,1657],[120,0,736,1578],[847,736,0,1563],[1657,1578,1563,0]]

##def distance_calc(locations, count):
##    locations_list = []
##    distance_list = []
##    new_count = count
##    for y in range(count):
##        for x in range(new_count - 1):
##            distance = float(input('Enter Distance between {} and {} '.format(locations[y], locations[x+y+1])))
##            locations_tuple = (locations[y], locations[x + y + 1], distance)
##            locations_list.append(locations_tuple)
##            distance_tuple = (y, x + y + 1,distance)
##            distance_list.append(distance_tuple)
##        new_count = new_count - 1
##
##    return locations_list, distance_list
##
##def distance_calc(locations, count):
##    locations_list = []
##    distance_list = []
##    #new_count = count
##    for y in range(count):
##        for x in range(count):
##            if (locations[y] == locations[x]):
##                locations_tuple = (locations[y], locations[x], 0)
##                locations_list.append(locations_tuple)
##                #distance_tuple = (y, x,0)
##                distances
##                distance_list.append(distance_tuple)
##            else:
##                distance = float(input('Enter Distance between {} and {} '.format(locations[y], locations[x])))
##                locations_tuple = (locations[y], locations[x], distance)
##                locations_list.append(locations_tuple)
##                #distance_tuple = (y, x,distance)
##                distance_list.append(distance_tuple)
##           
##    print(distance_list)
##    
##
##    return locations_list, distance_list
##
##locations = list_of_locations(number_of_locations)
##distance_calc(locations, number_of_locations)
##
def create_data_model(distance_matrix):
    """Stores the data for the problem."""
    data = {}
    data['distance_matrix'] = distance_matrix
    data['num_vehicles'] = 1
    data['starts'] = [0]
    data['ends'] = [5]
    #data['depot'] = 0
    return data

def print_solution(manager, routing, solution):
  """Prints solution on console."""
  print('Distance Travelled: {} miles'.format(solution.ObjectiveValue()))
  index = routing.Start(0)
  plan_output = 'Route for vehicle 0:\n'
  route_distance = 0
  while not routing.IsEnd(index):
    plan_output += ' {} ->'.format(manager.IndexToNode(index))
    previous_index = index
    index = solution.Value(routing.NextVar(index))
    route_distance += routing.GetArcCostForVehicle(previous_index, index, 0)
  plan_output += ' {}\n'.format(manager.IndexToNode(index))
  print(plan_output)
  plan_output += 'Route distance: {}miles\n'.format(route_distance)

def main():
    """Solve the TSP."""
    locations, start_point, end_point = list_of_locations(number_of_locations)
    distance_matrix = calculate_distance_matrix(locations)
    data = create_data_model(distance_matrix)
##    manager = pywrapcp.RoutingIndexManager(len(data['distance_matrix']),
##                                           data['num_vehicles'], data['depot'])
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
        print_solution(manager, routing, solution)

if __name__ == '__main__':
  main()
