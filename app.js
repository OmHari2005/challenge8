// ===============================
// DELIVERY NETWORK DATA
// ===============================

const deliveryNetwork = {

    locations: [
        { id: "L1", name: "Main Warehouse" },
        { id: "L2", name: "Sector 18" },
        { id: "L3", name: "Pari Chowk" },
        { id: "L4", name: "Knowledge Park" },
        { id: "L5", name: "Greater Noida West" },
        { id: "L6", name: "Noida Sector 62" },
        { id: "L7", name: "Dadri" },
        { id: "L8", name: "Alpha 1" }
    ],

    roads: [
        { from: "L1", to: "L2", distance: 8 },
        { from: "L1", to: "L3", distance: 5 },
        { from: "L2", to: "L3", distance: 4 },
        { from: "L2", to: "L4", distance: 6 },
        { from: "L3", to: "L4", distance: 3 },
        { from: "L3", to: "L5", distance: 7 },
        { from: "L4", to: "L5", distance: 2 },
        { from: "L4", to: "L6", distance: 9 },
        { from: "L5", to: "L6", distance: 5 },
        { from: "L5", to: "L7", distance: 8 },
        { from: "L6", to: "L8", distance: 4 },
        { from: "L7", to: "L8", distance: 6 }
    ]

};


// ===============================
// CREATE GRAPH
// ===============================

function createGraph() {

    const graph = {};

    deliveryNetwork.locations.forEach(function (location) {

        graph[location.id] = [];

    });


    deliveryNetwork.roads.forEach(function (road) {

        graph[road.from].push({
            node: road.to,
            distance: road.distance
        });


        graph[road.to].push({
            node: road.from,
            distance: road.distance
        });

    });


    return graph;
}


// ===============================
// DIJKSTRA ALGORITHM
// ===============================

function dijkstra(graph, start) {

    const distances = {};
    const previous = {};
    const visited = {};


    Object.keys(graph).forEach(function (node) {

        distances[node] = Infinity;

        previous[node] = null;

        visited[node] = false;

    });


    distances[start] = 0;


    for (
        let i = 0;
        i < Object.keys(graph).length;
        i++
    ) {

        let currentNode = null;

        let smallestDistance = Infinity;


        Object.keys(graph).forEach(function (node) {

            if (
                !visited[node] &&
                distances[node] < smallestDistance
            ) {

                smallestDistance = distances[node];

                currentNode = node;

            }

        });


        if (currentNode === null) {

            break;

        }


        visited[currentNode] = true;


        graph[currentNode].forEach(function (neighbour) {

            const newDistance =
                distances[currentNode] +
                neighbour.distance;


            if (
                newDistance <
                distances[neighbour.node]
            ) {

                distances[neighbour.node] = newDistance;

                previous[neighbour.node] = currentNode;

            }

        });

    }


    return {
        distances: distances,
        previous: previous
    };
}


// ===============================
// GET LOCATION NAME
// ===============================

function getLocationName(id) {

    const location =
        deliveryNetwork.locations.find(
            function (location) {

                return location.id === id;

            }
        );


    return location ? location.name : id;
}


// ===============================
// BUILD ACTUAL ROUTE
// ===============================

function buildPath(
    previous,
    start,
    destination
) {

    const path = [];

    let current = destination;


    while (current !== null) {

        path.unshift(current);


        if (current === start) {

            break;

        }


        current = previous[current];

    }


    if (path[0] !== start) {

        return [];

    }


    return path;
}


// ===============================
// FIND SHORTEST ROUTE
// ===============================

function findShortestRoute(
    start,
    destination
) {

    const graph = createGraph();


    const result =
        dijkstra(graph, start);


    const path =
        buildPath(
            result.previous,
            start,
            destination
        );


    return {

        path: path,

        distance:
            result.distances[destination]

    };
}


// ===============================
// LOAD LOCATIONS INTO DROPDOWNS
// ===============================

function loadLocations() {

    const source =
        document.getElementById("source");


    const destination =
        document.getElementById("destination");


    deliveryNetwork.locations.forEach(
        function (location) {

            const option1 =
                document.createElement("option");


            option1.value =
                location.id;


            option1.textContent =
                location.name;


            source.appendChild(option1);


            const option2 =
                document.createElement("option");


            option2.value =
                location.id;


            option2.textContent =
                location.name;


            destination.appendChild(option2);

        }
    );

}


// ===============================
// DISPLAY ROUTE
// ===============================

function displayRoute(result) {

    const routePath =
        document.getElementById("routePath");


    routePath.innerHTML = "";


    result.path.forEach(
        function (locationId, index) {

            const locationElement =
                document.createElement("div");


            locationElement.className =
                "route-location";


            locationElement.textContent =
                getLocationName(locationId);


            routePath.appendChild(
                locationElement
            );


            if (
                index <
                result.path.length - 1
            ) {

                const arrow =
                    document.createElement("span");


                arrow.className =
                    "route-arrow";


                arrow.textContent = "→";


                routePath.appendChild(
                    arrow
                );

            }

        }
    );


    document.getElementById(
        "totalDistance"
    ).textContent =
        result.distance;


    document.getElementById(
        "distanceSmall"
    ).textContent =
        result.distance;


    document.getElementById(
        "totalStops"
    ).textContent =
        result.path.length;


    const time =
        result.distance * 3;


    document.getElementById(
        "estimatedTime"
    ).textContent =
        time + " min";

}


// ===============================
// BUTTON FUNCTION
// ===============================

function handleRouteSearch() {

    const source =
        document.getElementById(
            "source"
        ).value;


    const destination =
        document.getElementById(
            "destination"
        ).value;


    if (!source || !destination) {

        alert(
            "Please select both locations."
        );

        return;

    }


    if (source === destination) {

        alert(
            "Starting location and destination cannot be the same."
        );

        return;

    }


    const result =
        findShortestRoute(
            source,
            destination
        );


    if (result.path.length === 0) {

        alert(
            "No route found."
        );

        return;

    }


    displayRoute(result);


    document
        .getElementById("resultSection")
        .classList.remove("hidden");


    document
        .getElementById("emptyState")
        .classList.add("hidden");

}


// ==================================================
// RECENTLY VIEWED PRODUCTS
// ==================================================

// Product IDs are stored here.
// Newest product will be at the beginning.
let recentProductIds = [];


// Set is used to quickly check duplicates.
let recentProductSet = new Set();


// Maximum number of products in history.
const MAX_RECENT_PRODUCTS = 5;


// ===============================
// GET ALL PRODUCTS
// ===============================

function getAllProductsForRecent() {

    const products = [];


    // Check all categories
    Object.values(storeData.categories)
        .forEach(function (category) {

            // Check all subcategories
            Object.values(category.subcategories)
                .forEach(function (subcategory) {

                    // Add every product
                    subcategory.products.forEach(
                        function (product) {

                            products.push(product);

                        }
                    );

                });

        });


    return products;
}


// ===============================
// DISPLAY PRODUCTS
// ===============================

function displayProducts() {

    const productList =
        document.getElementById(
            "productList"
        );


    productList.innerHTML = "";


    const products =
        getAllProductsForRecent();


    // Display first 10 products
    products.slice(0, 10)
        .forEach(function (product) {

            const card =
                document.createElement("div");


            card.className =
                "recent-product";


            card.innerHTML = `

                <h3>${product.name}</h3>

                <p>
                    Brand: ${product.brand}
                </p>

                <p>
                    ₹${product.price}
                </p>

                <p>
                    ⭐ ${product.rating}
                </p>

                <button
                    class="view-product-btn"
                    data-product-id="${product.id}"
                >
                    View Product
                </button>

            `;


            productList.appendChild(card);

        });


    // Add click event to every View Product button
    document
        .querySelectorAll(".view-product-btn")
        .forEach(function (button) {

            button.addEventListener(
                "click",
                function () {

                    const productId =
                        button.dataset.productId;


                    viewProduct(productId);

                }
            );

        });

}


// ===============================
// VIEW PRODUCT
// ===============================

function viewProduct(productId) {

    // If product already exists,
    // remove it from its old position.
    if (recentProductSet.has(productId)) {

        recentProductIds =
            recentProductIds.filter(
                function (id) {

                    return id !== productId;

                }
            );

    }


    // Add product to the beginning.
    recentProductIds.unshift(
        productId
    );


    // Add product to Set.
    recentProductSet.add(
        productId
    );


    // If more than 5 products,
    // remove the oldest product.
    if (
        recentProductIds.length >
        MAX_RECENT_PRODUCTS
    ) {

        const oldestProduct =
            recentProductIds.pop();


        recentProductSet.delete(
            oldestProduct
        );

    }


    // Update Recently Viewed section.
    displayRecentlyViewed();

}


// ===============================
// DISPLAY RECENTLY VIEWED
// ===============================

function displayRecentlyViewed() {

    const recentProducts =
        document.getElementById(
            "recentProducts"
        );


    recentProducts.innerHTML = "";


    // Empty state
    if (recentProductIds.length === 0) {

        recentProducts.innerHTML = `
            <p class="empty-message">
                No products viewed yet.
            </p>
        `;

        return;

    }


    const allProducts =
        getAllProductsForRecent();


    recentProductIds.forEach(
        function (productId) {

            const product =
                allProducts.find(
                    function (item) {

                        return item.id === productId;

                    }
                );


            if (!product) {

                return;

            }


            const card =
                document.createElement("div");


            card.className =
                "recent-product";


            card.innerHTML = `

                <h3>
                    ${product.name}
                </h3>

                <p>
                    ${product.brand}
                </p>

                <p>
                    ₹${product.price}
                </p>

                <p>
                    ⭐ ${product.rating}
                </p>

            `;


            recentProducts.appendChild(
                card
            );

        }
    );

}


// ===============================
// CLEAR HISTORY
// ===============================

function clearRecentHistory() {

    // Empty the array
    recentProductIds = [];


    // Empty the Set
    recentProductSet.clear();


    // Update the UI
    displayRecentlyViewed();

}


// ===============================
// START APPLICATION
// ===============================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        // Challenge 8
        loadLocations();


        document
            .getElementById("findRoute")
            .addEventListener(
                "click",
                handleRouteSearch
            );


        // Challenge 3
        displayProducts();


        displayRecentlyViewed();


        document
            .getElementById("clearHistory")
            .addEventListener(
                "click",
                clearRecentHistory
            );

    }
);