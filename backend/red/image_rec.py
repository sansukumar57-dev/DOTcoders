import cv2
import numpy as np
from sklearn.cluster import DBSCAN

def detect_dots(image_path)):
    img = cv2.imread(image_path))
    if img is None:
        return None, None

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    thresh = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
                                   cv2.THRESH_BINARY_INV, 11, 2)
    thresh = 255 - thresh

    params = cv2.SimpleBlobDetector_Params()
    params.filterByArea = True
    params.minArea = 5
    params.maxArea = 150
    params.filterByCircularity = True
    params.minCircularity = 0.6
    params.filterByConvexity = True
    params.minConvexity = 0.85
    params.filterByInertia = True
    params.minInertiaRatio = 0.1

    detector = cv2.SimpleBlobDetector_create(params)
    keypoints = detector.detect(thresh)
    return keypoints, img

def detect_contours(image_path):
    img = cv2.imread(image_path)
    if img is None:
        return None, None

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    thresh = cv2.inRange(gray, 200, 255)
    contours, _ = cv2.findContours(thresh, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)

    filtered = [c for c in contours if cv2.contourArea(c) > 50]
    return filtered, img

def analyze_principles(keypoints, contours, image_shape):
    if not keypoints:
        return {"error": "No dots detected"}

    coords = np.array([kp.pt for kp in keypoints])
    if len(coords) > 1:
        num_rows = len(set(DBSCAN(eps=10, min_samples=1).fit(coords[:,1].reshape(-1,1)).labels_))
        num_cols = len(set(DBSCAN(eps=10, min_samples=1).fit(coords[:,0].reshape(-1,1)).labels_))
    else:
        num_rows = num_cols = 1

    mid_x = image_shape[1] / 2
    left_dots = sum(1 for kp in keypoints if kp.pt[0] < mid_x)
    right_dots = sum(1 for kp in keypoints if kp.pt[0] > mid_x)
    is_symmetric = abs(left_dots - right_dots) <= max(2, len(keypoints)*0.1)

    return {
        "dot_count": len(keypoints),
        "contour_count": len(contours) if contours is not None else 0,
        "grid": {"rows": num_rows, "cols": num_cols},
        "is_symmetric": is_symmetric,
        "dots": coords.tolist()
    }
