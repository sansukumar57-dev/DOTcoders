# # import turtle
# # import numpy as np
# # import cv2
# # from PIL import Image

# # def recreate_kolam_turtle(contours, image_shape, save_path="recreated_kolam.png"):
# #     """
# #     Recreate a Kolam using turtle graphics based on contours.

# #     Args:
# #         contours (list): List of contours detected (from OpenCV).
# #         image_shape (tuple): Shape of the original image (height, width, channels).
# #         save_path (str): Path to save the turtle-drawn image.
# #     """
# #     height, width, _ = image_shape

# #     # --- Setup turtle screen ---
# #     screen = turtle.Screen()
# #     screen.setup(width=width, height=height)
# #     screen.bgcolor("black")
# #     screen.title("Recreated Kolam")

# #     kolam_turtle = turtle.Turtle()
# #     kolam_turtle.speed(0)
# #     kolam_turtle.color("white")
# #     kolam_turtle.penup()

# #     # Scale coordinates from OpenCV (image) to turtle coordinates
# #     def to_turtle_coords(x, y):
# #         # OpenCV origin is top-left; turtle origin is center
# #         return x - width/2, height/2 - y

# #     for contour in contours:
# #         if len(contour) == 0:
# #             continue
# #         # Move to the first point of contour
# #         x0, y0 = to_turtle_coords(*contour[0][0])
# #         kolam_turtle.penup()
# #         kolam_turtle.goto(x0, y0)
# #         kolam_turtle.pendown()
# #         # Draw the contour
# #         for point in contour[1:]:
# #             x, y = to_turtle_coords(*point[0])
# #             kolam_turtle.goto(x, y)
# #         kolam_turtle.penup()

# #     # --- Save the turtle drawing to PNG ---
# #     canvas = screen.getcanvas()
# #     canvas.postscript(file="temp_kolam.ps", colormode='color')
# #     img = Image.open("temp_kolam.ps")
# #     img.save(save_path, "PNG")

# #     turtle.bye()  # Close the turtle window
# # #     return save_path
# # from xml.etree.ElementTree import Element, SubElement, tostring

# # def recreate_kolam_svg(contours, image_shape, save_path="recreated_kolam.svg"):
# #     """
# #     Recreates a Kolam design as an SVG for scalable output.
    
# #     Args:
# #         contours (list): List of contours from OpenCV.
# #         image_shape (tuple): Original image shape (height, width, channels).
# #         save_path (str): Path to save the generated SVG.
        
# #     Returns:
# #         str: Path to saved SVG file.
# #     """
# #     height, width, _ = image_shape

# #     svg = Element('svg', xmlns="http://www.w3.org/2000/svg",
# #                   width=str(width), height=str(height),
# #                   viewBox=f"0 0 {width} {height}")

# #     for contour in contours:
# #         if len(contour) == 0:
# #             continue
# #         points = " ".join(f"{pt[0][0]},{pt[0][1]}" for pt in contour)
# #         SubElement(svg, 'polyline', points=points,
# #                    stroke="black", fill="none", stroke_width="2")

# #     with open(save_path, "wb") as f:
# #         f.write(tostring(svg))

# #     return save_path
# from xml.etree.ElementTree import Element, SubElement, tostring
# import cv2
# import numpy as np

# def recreate_kolam_svg(colored_contours, image_shape, save_path="recreated_kolam.svg",
#                        stroke_color="black", dot_color="red", stroke_width=2, dot_radius=3):
#     """
#     Recreates a Kolam design as an SVG with decorative dots and color options.

#     Args:
#         colored_contours (list): List of contours from OpenCV.
#         image_shape (tuple): Original image shape (height, width, channels).
#         save_path (str): Output SVG path.
#         stroke_color (str): Color of the main Kolam lines.
#         dot_color (str): Color of decorative dots.
#         stroke_width (int): Width of the contour lines.
#         dot_radius (int): Radius of decorative dots inside loops.

#     Returns:
#         str: Path to the saved SVG.
#     """
#     height, width, _ = image_shape

#     svg = Element('svg', xmlns="http://www.w3.org/2000/svg",
#                   width=str(width), height=str(height),
#                   viewBox=f"0 0 {width} {height}")

#     for contour in colored_contours:
#         if len(contour) == 0:
#             continue

#         # Draw contour
#         points = " ".join(f"{pt[0][0]},{pt[0][1]}" for pt in contour)
#         SubElement(svg, 'polyline', points=points,
#                    stroke=stroke_color, fill="none", stroke_width=str(stroke_width))

#         # Optional: add a dot at the centroid if contour is reasonably circular
#         area = cv2.contourArea(contour)
#         perimeter = cv2.arcLength(contour, True)
#         if perimeter > 0:
#             circularity = (4 * np.pi * area) / (perimeter * perimeter)
#             if circularity > 0.6 and 100 < area < 5000:
#                 M = cv2.moments(contour)
#                 if M["m00"] != 0:
#                     cX = int(M["m10"] / M["m00"])
#                     cY = int(M["m01"] / M["m00"])
#                     SubElement(svg, 'circle', cx=str(cX), cy=str(cY),
#                                r=str(dot_radius), fill=dot_color)

#     with open(save_path, "wb") as f:
#         f.write(tostring(svg))

#     return save_path
from xml.etree.ElementTree import Element, SubElement, tostring
import cv2
import turtle
import tensorflow as tf
import cv2
import numpy as np
import image_rec


# --- Step 1: Load image and detect features ---
image_path = 'kolam_sample.jpg' 

img = cv2.imread(image_path)
 # Replace with your Kolam image
dots, _ = image_rec.detect_dots(image_path)
contours, _ = image_rec.detect_contours(image_path)


if img is None:
    raise FileNotFoundError(f"Cannot read {image_path}")

# --- Step 2: Convert to grayscale using TensorFlow ---
# Convert to float32 tensor
img_tensor = tf.convert_to_tensor(img, dtype=tf.float32)

# Use standard RGB to grayscale formula: Y = 0.2989 R + 0.5870 G + 0.1140 B
gray_tensor = tf.tensordot(img_tensor, [0.2989, 0.5870, 0.1140], axes=1)

# Convert back to numpy uint8 for OpenCV
gray_image = tf.cast(gray_tensor, tf.uint8).numpy()




if dots is None or contours is None:
    print("No dots or contours detected!")
    exit()

cv2.imwrite("kolam_grayscale.png", gray_image)
print("Grayscale image saved as kolam_grayscale.png")

# Convert OpenCV coordinates to Turtle coordinates
# OpenCV origin is top-left, Turtle origin is center
img = cv2.imread(image_path)



h, w = img.shape[:2]

def to_turtle_coords(x, y):
    return x - w/2, h/2 - y


# --- Step 2: Setup Turtle ---
screen = turtle.Screen()
screen.setup(width=w+50, height=h+50)
screen.bgcolor("black")
t = turtle.Turtle()
t.hideturtle()
t.speed(0)
t.color("white")
t.pensize(2)

# --- Step 3: Drawcontours ---
for contour in contours:
    points = contour.reshape(-1, 2)
    if len(points) == 0:
        continue
    x, y = to_turtle_coords(*points[0])
    t.penup()
    t.goto(x, y)
    t.pendown()
    for px, py in points[1:]:
        tx, ty = to_turtle_coords(px, py)
        t.goto(tx, ty)
    t.penup()

# --- Step 4: Draw dots ---
t.dot(3, "red")  # Optional: red dots for pullis
for kp in dots:
    x, y = to_turtle_coords(*kp.pt)
    t.goto(x, y)
    t.dot(4, "yellow")

t.color("yellow")
for kp in dots:
    x, y = to_turtle_coords(*kp.pt)
    t.goto(x, y)
    t.dot(4)

# --- Step 5: Finish ---
turtle.done()


def recreate_kolam_svg(contours, image_shape, save_path="recreated_kolam.svg",
                       stroke_color="black", dot_color="red",
                       stroke_width=2, dot_radius=3):
    """
    Recreates a Kolam as an SVG with contours and decorative dots.
    """
    height, width, _ = image_shape

    svg = Element('svg', xmlns="http://www.w3.org/2000/svg",
                  width=str(width), height=str(height),
                  viewBox=f"0 0 {width} {height}")

    for contour in contours:
        if len(contour) == 0:
            continue

        points = " ".join(f"{pt[0][0]},{pt[0][1]}" for pt in contour)
        SubElement(svg, 'polyline', points=points,
                   stroke=stroke_color, fill="none", stroke_width=str(stroke_width))

        # Decorative dot for circular loops
        area = cv2.contourArea(contour)
        perimeter = cv2.arcLength(contour, True)
        if perimeter > 0:
            circularity = (4 * 3.14159 * area) / (perimeter * perimeter)
            if circularity > 0.6 and 100 < area < 5000:
                M = cv2.moments(contour)
                if M["m00"] != 0:
                    cX = int(M["m10"] / M["m00"])
                    cY = int(M["m01"] / M["m00"])
                    SubElement(svg, 'circle', cx=str(cX), cy=str(cY),
                               r=str(dot_radius), fill=dot_color)

    with open(save_path, "wb") as f:
        f.write(tostring(svg))

    return save_path
