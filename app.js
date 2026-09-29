// ==================================================
// TECHMART
// CHALLENGE 8 + CHALLENGE 3
// ==================================================


// ==================================================
// CHALLENGE 8
// SMART DELIVERY ROUTE
// ==================================================


// Delivery network
// Locations are the vertices/nodes.
// Roads are the edges.
// Distance is the weight of each edge.

const deliveryNetwork = {

    locations: [

        {
            id: "L1",
            name: "Main Warehouse"
        },

        {
            id: "L2",
            name: "Sector 18"
        },

        {
            id: "L3",
            name: "Pari Chowk"
        },

        {
            id: "L4",
            name: "Knowledge Park"
        },

        {
            id: "L5",
            name: "Greater Noida West"
        },

        {
            id: "L6",
            name: "Noida Sector 62"
        },

        {
            id: "L7",
            name: "Dadri"
        },

        {
            id: "L8",
            name: "Alpha 1"
        }

    ],


    roads: [

        {
            from: "L1",
            to: "L2",
            distance: 8
        },

        {
            from: "L1",
            to: "L3",
            distance: 5
        },

        {
            from: "L2",
            to: "L3",
            distance: 4
        },

        {
            from: "L2",
            to: "L4",
            distance: 6
        },

        {
            from: "L3",
            to: "L4",
            distance: 3
        },

        {
            from: "L3",
            to: "L5",
            distance: 7
        },

        {
            from: "L4",
            to: "L5",
            distance: 2
        },

        {
            from: "L4",
            to: "L6",
            distance: 9
        },

        {
            from: "L5",
            to: "L6",
            distance: 5
        },

        {
            from: "L5",
            to: "L7",
            distance: 8
        },

        {
            from: "L6",
            to: "L8",
            distance: 4
        },

        {
            from: "L7",
            to: "L8",
            distance: 6
        }

    ]

};



// ==================================================
// CREATE GRAPH
// ==================================================

function createGraph() {

    const graph = {};

    deliveryNetwork.locations.forEach(
        function (location) {

            graph[location.id] = [];

        }
    );


    deliveryNetwork.roads.forEach(
        function (road) {

            graph[road.from].push({

                node: road.to,

                distance: road.distance

            });


            graph[road.to].push({

                node: road.from,

                distance: road.distance

            });

        }
    );


    return graph;

}



// ==================================================
// DIJKSTRA ALGORITHM
// ==================================================

function dijkstra(graph, start) {

    const distances = {};

    const previous = {};

    const visited = new Set();


    // Initially every distance is Infinity.

    Object.keys(graph).forEach(
        function (node) {

            distances[node] = Infinity;

            previous[node] = null;

        }
    );


    // Distance from start to itself is zero.

    distances[start] = 0;


    while (visited.size < Object.keys(graph).length) {

        let currentNode = null;

        let smallestDistance = Infinity;


        // Find the unvisited node
        // having the smallest distance.

        Object.keys(graph).forEach(
            function (node) {

                if (
                    !visited.has(node) &&
                    distances[node] < smallestDistance
                ) {

                    smallestDistance =
                        distances[node];

                    currentNode = node;

                }

            }
        );


        // If no node is reachable,
        // stop the algorithm.

        if (currentNode === null) {

            break;

        }


        // Mark current node as visited.

        visited.add(currentNode);


        // Check all neighbouring nodes.

        graph[currentNode].forEach(
            function (neighbor) {

                const newDistance =
                    distances[currentNode] +
                    neighbor.distance;


                // If this route is shorter,
                // update the distance.

                if (
                    newDistance <
                    distances[neighbor.node]
                ) {

                    distances[neighbor.node] =
                        newDistance;

                    previous[neighbor.node] =
                        currentNode;

                }

            }
        );

    }


    return {

        distances: distances,

        previous: previous

    };

}



// ==================================================
// GET LOCATION NAME
// ==================================================

function getLocationName(id) {

    const location =
        deliveryNetwork.locations.find(
            function (item) {

                return item.id === id;

            }
        );


    return location
        ? location.name
        : id;

}



// ==================================================
// BUILD SHORTEST PATH
// ==================================================

function buildPath(
    previous,
    start,
    destination
) {

    const path = [];

    let current = destination;


    while (current !== null) {

        path.unshift(current);

        current = previous[current];

    }


    // If the starting node is not reached,
    // there is no valid path.

    if (path[0] !== start) {

        return [];

    }


    return path;

}



// ==================================================
// FIND SHORTEST ROUTE
// ==================================================

function findShortestRoute(
    start,
    destination
) {

    const graph =
        createGraph();


    const result =
        dijkstra(
            graph,
            start
        );


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



// ==================================================
// LOAD LOCATIONS INTO DROPDOWNS
// ==================================================

function loadLocations() {

    const source =
        document.getElementById(
            "source"
        );


    const destination =
        document.getElementById(
            "destination"
        );


    if (!source || !destination) {

        return;

    }


    deliveryNetwork.locations.forEach(
        function (location) {

            const option1 =
                document.createElement(
                    "option"
                );


            option1.value =
                location.id;


            option1.textContent =
                location.name;


            source.appendChild(
                option1
            );


            const option2 =
                document.createElement(
                    "option"
                );


            option2.value =
                location.id;


            option2.textContent =
                location.name;


            destination.appendChild(
                option2
            );

        }
    );

}



// ==================================================
// DISPLAY ROUTE
// ==================================================

function displayRoute(result) {

    const routePath =
        document.getElementById(
            "routePath"
        );


    if (!routePath) {

        return;

    }


    routePath.innerHTML = "";


    result.path.forEach(
        function (
            locationId,
            index
        ) {

            const locationElement =
                document.createElement(
                    "div"
                );


            locationElement.className =
                "route-location";


            locationElement.textContent =
                getLocationName(
                    locationId
                );


            routePath.appendChild(
                locationElement
            );


            if (
                index <
                result.path.length - 1
            ) {

                const arrow =
                    document.createElement(
                        "span"
                    );


                arrow.className =
                    "route-arrow";


                arrow.textContent =
                    "→";


                routePath.appendChild(
                    arrow
                );

            }

        }
    );


    const totalDistance =
        document.getElementById(
            "totalDistance"
        );


    const distanceSmall =
        document.getElementById(
            "distanceSmall"
        );


    const totalStops =
        document.getElementById(
            "totalStops"
        );


    const estimatedTime =
        document.getElementById(
            "estimatedTime"
        );


    if (totalDistance) {

        totalDistance.textContent =
            result.distance;

    }


    if (distanceSmall) {

        distanceSmall.textContent =
            result.distance;

    }


    if (totalStops) {

        totalStops.textContent =
            result.path.length;

    }


    if (estimatedTime) {

        const time =
            result.distance * 3;


        estimatedTime.textContent =
            time + " min";

    }

}



// ==================================================
// HANDLE ROUTE SEARCH
// ==================================================

function handleRouteSearch() {

    const sourceElement =
        document.getElementById(
            "source"
        );


    const destinationElement =
        document.getElementById(
            "destination"
        );


    if (
        !sourceElement ||
        !destinationElement
    ) {

        return;

    }


    const source =
        sourceElement.value;


    const destination =
        destinationElement.value;


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


    const resultSection =
        document.getElementById(
            "resultSection"
        );


    const emptyState =
        document.getElementById(
            "emptyState"
        );


    if (resultSection) {

        resultSection.classList.remove(
            "hidden"
        );

    }


    if (emptyState) {

        emptyState.classList.add(
            "hidden"
        );

    }

}



// ==================================================
// CHALLENGE 3
// RECENTLY VIEWED PRODUCTS
// ==================================================


// --------------------------------------------------
// SAMPLE TECHMART DATA
// --------------------------------------------------
//
// Your original dataset was not present in the
// uploaded app.js. So these products are sample
// products only.
//
// The Recently Viewed algorithm does not depend
// on the number of products.
//
// --------------------------------------------------

const storeData = {

    categories: {

        electronics: {

            name: "Electronics",

            subcategories: {

                smartphones: {

                    name: "Smartphones",

                    products: [

                        {
                            id: "P001",
                            name: "Samsung Galaxy S24",
                            brand: "Samsung",
                            price: 74999,
                            originalPrice: 79999,
                            rating: 4.5,
                            reviews: 1250,
                            stock: 20
                        },

                        {
                            id: "P002",
                            name: "iPhone 15",
                            brand: "Apple",
                            price: 69999,
                            originalPrice: 79999,
                            rating: 4.7,
                            reviews: 2100,
                            stock: 15
                        },

                        {
                            id: "P003",
                            name: "OnePlus 12",
                            brand: "OnePlus",
                            price: 64999,
                            originalPrice: 69999,
                            rating: 4.6,
                            reviews: 980,
                            stock: 18
                        }

                    ]

                },


                laptops: {

                    name: "Laptops",

                    products: [

                        {
                            id: "P004",
                            name: "MacBook Air M3",
                            brand: "Apple",
                            price: 99999,
                            originalPrice: 109999,
                            rating: 4.8,
                            reviews: 850,
                            stock: 10
                        },

                        {
                            id: "P005",
                            name: "Dell Inspiron 15",
                            brand: "Dell",
                            price: 58999,
                            originalPrice: 64999,
                            rating: 4.3,
                            reviews: 720,
                            stock: 25
                        },

                        {
                            id: "P006",
                            name: "HP Pavilion 14",
                            brand: "HP",
                            price: 62999,
                            originalPrice: 69999,
                            rating: 4.4,
                            reviews: 650,
                            stock: 16
                        }

                    ]

                },


                audio: {

                    name: "Audio",

                    products: [

                        {
                            id: "P007",
                            name: "Sony WH-1000XM5",
                            brand: "Sony",
                            price: 29999,
                            originalPrice: 34999,
                            rating: 4.7,
                            reviews: 1500,
                            stock: 30
                        },

                        {
                            id: "P008",
                            name: "AirPods Pro 2",
                            brand: "Apple",
                            price: 24999,
                            originalPrice: 26999,
                            rating: 4.6,
                            reviews: 1800,
                            stock: 22
                        },

                        {
                            id: "P009",
                            name: "JBL Tune 770NC",
                            brand: "JBL",
                            price: 6999,
                            originalPrice: 8999,
                            rating: 4.4,
                            reviews: 950,
                            stock: 40
                        }

                    ]

                }

            }

        }

    }

};



// ==================================================
// RECENT HISTORY VARIABLES
// ==================================================


// Array stores product IDs.
// Newest product is stored first.

let recentProductIds = [];


// Set helps us check duplicates quickly.

let recentProductSet = new Set();


// Maximum 5 products.

const MAX_RECENT_PRODUCTS = 5;



// ==================================================
// GET ALL PRODUCTS
// ==================================================

function getAllProductsForRecent() {

    const products = [];


    Object.values(
        storeData.categories
    ).forEach(
        function (category) {

            Object.values(
                category.subcategories
            ).forEach(
                function (subcategory) {

                    subcategory.products.forEach(
                        function (product) {

                            products.push(
                                product
                            );

                        }
                    );

                }
            );

        }
    );


    return products;

}



// ==================================================
// CREATE PRODUCT SECTION
// ==================================================

function createProductSection() {

    // If product section already exists,
    // do nothing.

    if (
        document.getElementById(
            "productExplorer"
        )
    ) {

        return;

    }


    const recentlyViewed =
        document.querySelector(
            ".recently-viewed"
        );


    if (!recentlyViewed) {

        return;

    }


    const section =
        document.createElement(
            "section"
        );


    section.id =
        "productExplorer";


    section.className =
        "card";


    section.style.marginTop =
        "30px";


    section.innerHTML = `

        <div class="section-heading">

            <div class="heading-icon">
                🛍️
            </div>

            <div>

                <h2>
                    TechMart Products
                </h2>

                <p>
                    Click View Product to add it to Recently Viewed.
                </p>

            </div>

        </div>


        <div
            id="productList"
            class="recent-products"
        >
        </div>

    `;


    // Put product section before
    // Recently Viewed.

    recentlyViewed.parentNode.insertBefore(
        section,
        recentlyViewed
    );

}



// ==================================================
// DISPLAY PRODUCTS
// ==================================================

function displayProducts() {

    const productList =
        document.getElementById(
            "productList"
        );


    if (!productList) {

        return;

    }


    productList.innerHTML =
        "";


    const products =
        getAllProductsForRecent();


    products.forEach(
        function (product) {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "recent-product";


            card.innerHTML = `

                <h3>
                    ${product.name}
                </h3>

                <p>
                    Brand: ${product.brand}
                </p>

                <p>
                    ₹${product.price}
                </p>

                <p>
                    ⭐ ${product.rating}
                </p>

                <p>
                    ${product.reviews} reviews
                </p>

                <button
                    class="view-product-btn"
                    data-product-id="${product.id}"
                >
                    View Product
                </button>

            `;


            productList.appendChild(
                card
            );

        }
    );


    // Add event to every button.

    document
        .querySelectorAll(
            ".view-product-btn"
        )
        .forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        const productId =
                            button.dataset.productId;


                        viewProduct(
                            productId
                        );

                    }
                );

            }
        );

}



// ==================================================
// VIEW PRODUCT
// ==================================================

function viewProduct(productId) {

    // If product already exists in history,
    // remove it first.

    if (
        recentProductSet.has(
            productId
        )
    ) {

        recentProductIds =
            recentProductIds.filter(
                function (id) {

                    return id !== productId;

                }
            );

    }


    // Add product at beginning.

    recentProductIds.unshift(
        productId
    );


    // Add product to Set.

    recentProductSet.add(
        productId
    );


    // Keep only 5 products.

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


    displayRecentlyViewed();

}



// ==================================================
// DISPLAY RECENTLY VIEWED
// ==================================================

function displayRecentlyViewed() {

    const recentProducts =
        document.getElementById(
            "recentProducts"
        );


    if (!recentProducts) {

        return;

    }


    recentProducts.innerHTML =
        "";


    // Empty state.

    if (
        recentProductIds.length === 0
    ) {

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

                        return (
                            item.id ===
                            productId
                        );

                    }
                );


            if (!product) {

                return;

            }


            const card =
                document.createElement(
                    "div"
                );


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



// ==================================================
// CLEAR HISTORY
// ==================================================

function clearRecentHistory() {

    // Empty array.

    recentProductIds = [];


    // Empty Set.

    recentProductSet.clear();


    // Refresh UI.

    displayRecentlyViewed();

}



// ==================================================
// START APPLICATION
// ==================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {


        // ------------------------------------------
        // CHALLENGE 8
        // ------------------------------------------

        loadLocations();


        const routeButton =
            document.getElementById(
                "findRoute"
            );


        if (routeButton) {

            routeButton.addEventListener(
                "click",
                handleRouteSearch
            );

        }



        // ------------------------------------------
        // CHALLENGE 3
        // ------------------------------------------

        createProductSection();


        displayProducts();


        displayRecentlyViewed();


        const clearButton =
            document.getElementById(
                "clearHistory"
            );


        if (clearButton) {

            clearButton.addEventListener(
                "click",
                clearRecentHistory
            );

        }

    }
);